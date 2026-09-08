"""Multi-agent StateGraph workflow runner for deterministic-first acute rescue."""

import time
from typing import Optional
from app.core.safety_gates import SafetyGateEngine
from app.core.state import EpistemicCertainty, MigraineRunState, TriageStatus
from app.engines.bandit_ranker import BayesianBanditRanker
from app.engines.route_engine import RouteSwitchingEngine
from app.engines.timing_engine import TimingEngine
from app.knowledge.viking_navigator import VikingContextNavigator
from app.skills.dosage_checker import DosageChecker
from app.telemetry.metrics import RescueMetrics


class MigraineStateGraphRunner:
    """Executes the deterministic-first multi-agent rescue optimization graph."""

    def __init__(self, viking_navigator: Optional[VikingContextNavigator] = None):
        self.viking = viking_navigator or VikingContextNavigator()

    def run(self, state: MigraineRunState) -> MigraineRunState:
        """Executes the multi-agent DAG with sub-50ms deterministic execution budget."""
        t_start = time.perf_counter()

        # Node 1: Intake & Normalization
        state.is_pediatric = state.patient_age < 18
        state.cot_trajectory.append({
            "node": "IntakeNormalizer",
            "status": "Completed",
            "is_pediatric": state.is_pediatric,
        })

        # Gate 1: SNOOP4 Safety Gate (Irreversible Emergency Gate)
        has_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
        if has_emergency:
            state.triage_status = TriageStatus.RED_FLAG_EMERGENCY
            state.snoop4_red_flags = flags
            state.emergency_divert_message = (
                "EMERGENCY: SNOOP4 red flag detected. Divert to 911 / Emergency Department."
            )
            state.cot_trajectory.append({
                "gate": "SNOOP4",
                "decision": "Diverted to Emergency",
                "flags": flags,
            })
            state.execution_latency_ms = (time.perf_counter() - t_start) * 1000.0
            RescueMetrics.record_request(state.execution_latency_ms, is_emergency=True)
            return state

        # Gate 2: MOH Quota Gate
        state.moh_limit_exceeded = SafetyGateEngine.evaluate_moh_quota(state)
        if state.moh_limit_exceeded:
            state.cot_trajectory.append({
                "gate": "MOH_Quota",
                "warning": "MOH Limit Exceeded (>=10 triptan days or >=15 NSAID days in 30d)",
            })

        # Node 2: Timing Engine (Central Sensitization Velocity)
        state.timing_urgency_minutes = TimingEngine.calculate_urgency_window(state)
        state.cutaneous_allodynia_flag = TimingEngine.predict_allodynia_lockin(state)
        state.cot_trajectory.append({
            "node": "TimingEngine",
            "urgency_minutes": state.timing_urgency_minutes,
            "allodynia_locked": state.cutaneous_allodynia_flag,
        })

        # Node 3: Route Switching Engine (Gastric Stasis)
        route, adjuvant, reasoning = RouteSwitchingEngine.select_delivery_route(state)
        route_switched = route != state.recommended_route
        state.recommended_route = route
        state.adjuvant_antiemetic = adjuvant
        state.route_switch_reasoning = reasoning
        state.cot_trajectory.append({
            "node": "RouteSwitchingEngine",
            "selected_route": route.value,
            "adjuvant": adjuvant,
        })

        # Node 4: Bayesian Bandit Molecule Ranker
        recommended_mol = BayesianBanditRanker.rank_molecules(state, route)
        state.recommended_molecule = recommended_mol
        
        # Populate dosage if in registry
        dosage_spec = DosageChecker.get_dosage_spec(recommended_mol)
        if dosage_spec:
            state.dosage_mg = dosage_spec["single_dose_mg"]

        state.epistemic_tier = EpistemicCertainty.LEVEL_1
        state.cot_trajectory.append({
            "node": "BayesianBanditRanker",
            "recommended_molecule": recommended_mol,
            "dosage_mg": state.dosage_mg,
        })

        # Node 5: OpenViking Context Navigation (80% Token Reduction)
        viking_result = self.viking.resolve_context(state)
        state.retrieved_pharmacology = viking_result
        state.cot_trajectory.append({
            "node": "OpenVikingContextResolver",
            "pruned_paths_count": len(state.viking_pruned_paths),
            "traversed_paths_count": len(state.viking_traversed_paths),
            "token_estimate": viking_result.get("token_estimate", 1350),
        })

        # Verification Assertion
        state.assertions_passed = (
            state.recommended_molecule is not None and state.recommended_route is not None
        )

        state.execution_latency_ms = (time.perf_counter() - t_start) * 1000.0
        state.cot_trajectory.append({
            "node": "Completion",
            "latency_ms": round(state.execution_latency_ms, 3),
        })

        RescueMetrics.record_request(state.execution_latency_ms, is_emergency=False, route_switched=route_switched)
        return state
