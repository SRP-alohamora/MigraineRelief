"""Administrative account service managing user lifecycles, password resets, and audit logging."""

import uuid
import secrets
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status


class AdminAccountService:
    """Manages platform user accounts, administrative password resets, and lifecycle actions."""

    # In-memory persistent state store for platform profiles, custom intakes, and audit logs
    _profiles: Dict[str, Dict[str, Any]] = {}
    _intakes: Dict[str, Dict[str, Any]] = {}
    _audit_logs: List[Dict[str, Any]] = []
    _initialized: bool = False

    @classmethod
    def _seed_defaults(cls):
        """Pre-seeds standard administrative and patient persona accounts."""
        if cls._initialized:
            return

        now = datetime.now(timezone.utc).isoformat()

        # 1. Default Administrator Account
        admin_id = "00000000-0000-0000-0000-000000000001"
        cls._profiles[admin_id] = {
            "id": admin_id,
            "email": "admin@migrainerelief.ai",
            "role": "admin",
            "status": "active",
            "created_at": "2026-08-01T00:00:00Z",
            "last_sign_in_at": now,
            "moh_days": 0,
        }

        # 2. Persona 1: Alexa Rivera (Adolescent Episodic Migraine)
        alexa_id = "00000000-0000-0000-0000-000000000002"
        cls._profiles[alexa_id] = {
            "id": alexa_id,
            "email": "alexa@school.edu",
            "role": "user",
            "status": "active",
            "created_at": "2026-08-12T14:30:00Z",
            "last_sign_in_at": now,
            "moh_days": 4,
        }
        cls._intakes[alexa_id] = {
            "user_id": alexa_id,
            "form_values": {
                "Age": 15,
                "Duration": 12,
                "Frequency": 3,
                "Location": 1,
                "Character": 1,
                "Intensity": 2,
                "Nausea": 1,
                "Vomit": 0,
                "Phonophobia": 1,
                "Photophobia": 1,
                "Visual": 1,
                "Sensory": 0,
                "Dysphasia": 0,
                "Dysarthria": 0,
                "Vertigo": 0,
                "Tinnitus": 0,
                "Hypoacusis": 0,
                "Diplopia": 0,
                "Defect": 0,
                "Ataxia": 0,
                "Conscience": 0,
                "Paresthesia": 0,
                "DPF": 1,
            },
            "aura_patterns": ["scintillating_scotoma"],
            "customized_protocol": {
                "tier_1_oral": "Rizatriptan 5mg ODT (Pediatric Clearance)",
                "tier_2_non_oral": "Zolmitriptan 2.5mg Nasal Spray",
                "adjuvant": "Non-sedating ginger or ondansetron ODT",
            },
            "aura_progression_notes": "Zigzag flashing lights in right visual field lasting ~25 minutes.",
            "gst_timestamp": "2026-08-12 18:30:00 GST",
            "updated_at": now,
        }

        # 3. Persona 2: Claire Sterling (Chronic Refractory Migraine with Gastroparesis)
        claire_id = "00000000-0000-0000-0000-000000000003"
        cls._profiles[claire_id] = {
            "id": claire_id,
            "email": "claire@corp.org",
            "role": "user",
            "status": "active",
            "created_at": "2026-08-15T09:15:00Z",
            "last_sign_in_at": now,
            "moh_days": 8,
        }
        cls._intakes[claire_id] = {
            "user_id": claire_id,
            "form_values": {
                "Age": 45,
                "Duration": 48,
                "Frequency": 18,
                "Location": 1,
                "Character": 1,
                "Intensity": 3,
                "Nausea": 1,
                "Vomit": 1,
                "Phonophobia": 1,
                "Photophobia": 1,
                "Visual": 1,
                "Sensory": 1,
                "Dysphasia": 0,
                "Dysarthria": 0,
                "Vertigo": 1,
                "Tinnitus": 0,
                "Hypoacusis": 0,
                "Diplopia": 0,
                "Defect": 0,
                "Ataxia": 0,
                "Conscience": 0,
                "Paresthesia": 1,
                "DPF": 1,
            },
            "aura_patterns": ["tunnel_vision", "sensory_tingling"],
            "customized_protocol": {
                "tier_1_oral": "Suppressed due to acute gastroparesis",
                "tier_2_non_oral": "Sumatriptan 6mg SC Auto-Injector or Intranasal POD DHE",
                "adjuvant": "Metoclopramide 10mg IV/IM",
            },
            "aura_progression_notes": "Rapid onset nausea within 30 min followed by cutaneous scalp allodynia.",
            "gst_timestamp": "2026-08-15 13:15:00 GST",
            "updated_at": now,
        }

        # 4. Inactive / Archived Demo Account
        archived_id = "00000000-0000-0000-0000-000000000004"
        cls._profiles[archived_id] = {
            "id": archived_id,
            "email": "legacy_patient@domain.net",
            "role": "user",
            "status": "archived",
            "created_at": "2026-07-10T11:00:00Z",
            "last_sign_in_at": "2026-07-25T14:00:00Z",
            "moh_days": 1,
        }

        cls._initialized = True

    @classmethod
    def list_all_accounts(
        cls,
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        profile_filter: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """Returns paginated, searchable, and filterable accounts list."""
        cls._seed_defaults()

        results = []
        for uid, prof in cls._profiles.items():
            # Status filtering
            if status_filter and status_filter.lower() != "all":
                if prof["status"].lower() != status_filter.lower():
                    continue

            # Clinical profile filter (configured vs pending)
            has_profile = uid in cls._intakes
            if profile_filter and profile_filter.lower() != "all":
                if profile_filter.lower() == "configured" and not has_profile:
                    continue
                if profile_filter.lower() == "pending" and has_profile:
                    continue

            # Search text filtering (email or UUID)
            if search:
                query = search.lower().strip()
                if query not in prof["email"].lower() and query not in uid.lower():
                    continue

            account_data = dict(prof)
            account_data["has_custom_intake"] = has_profile
            account_data["intake_summary"] = (
                f"{len(cls._intakes[uid].get('aura_patterns', []))} auras, {cls._intakes[uid].get('customized_protocol', {}).get('tier_2_non_oral', 'Standard')}"
                if has_profile
                else "No custom clinical intake submitted"
            )
            results.append(account_data)

        # Sort: Admin first, then newest registered
        results.sort(key=lambda x: (x["role"] != "admin", x["created_at"]), reverse=False)

        total_records = len(results)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_items = results[start_idx:end_idx]

        # Summary platform statistics
        active_count = sum(1 for p in cls._profiles.values() if p["status"] == "active")
        archived_count = sum(1 for p in cls._profiles.values() if p["status"] == "archived")
        suspended_count = sum(1 for p in cls._profiles.values() if p["status"] == "suspended")

        return {
            "total": total_records,
            "page": page,
            "limit": limit,
            "total_pages": max(1, (total_records + limit - 1) // limit),
            "stats": {
                "total_users": len(cls._profiles),
                "active_users": active_count,
                "archived_users": archived_count,
                "suspended_users": suspended_count,
                "cogs_monthly": "$0.00",
                "cogs_status": "Near-$0 Free Tier Active (GoTrue + PostgreSQL RLS)",
            },
            "accounts": paginated_items,
        }

    @classmethod
    def reset_user_password(
        cls, admin_id: str, target_user_id: str, custom_temp_password: Optional[str] = None
    ) -> Dict[str, Any]:
        """Triggers password reset, generates recovery link, or sets temporary password."""
        cls._seed_defaults()

        if target_user_id not in cls._profiles:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User account with ID '{target_user_id}' does not exist.",
            )

        user_email = cls._profiles[target_user_id]["email"]
        temp_pwd = custom_temp_password or f"Rescue-{secrets.token_hex(4).upper()}!2026"
        recovery_token = secrets.token_urlsafe(24)
        recovery_url = f"https://localhost:5173/login?reset_token={recovery_token}&email={user_email}"

        # Record action in audit log
        cls._record_audit(
            admin_id=admin_id,
            target_user_id=target_user_id,
            action="RESET_PASSWORD",
            details={
                "email": user_email,
                "recovery_url_generated": True,
                "temp_password_issued": bool(temp_pwd),
            },
        )

        return {
            "success": True,
            "target_user_id": target_user_id,
            "email": user_email,
            "temporary_password": temp_pwd,
            "recovery_url": recovery_url,
            "message": f"Password reset instructions and temporary access key generated for {user_email}.",
        }

    @classmethod
    def set_user_status(
        cls, admin_id: str, target_user_id: str, new_status: str, reason: str = "Administrative action"
    ) -> Dict[str, Any]:
        """Updates account status (active, suspended, archived)."""
        cls._seed_defaults()

        valid_statuses = ["active", "suspended", "archived"]
        if new_status.lower() not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status '{new_status}'. Allowed statuses: {valid_statuses}",
            )

        if target_user_id not in cls._profiles:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User account with ID '{target_user_id}' does not exist.",
            )

        old_status = cls._profiles[target_user_id]["status"]
        cls._profiles[target_user_id]["status"] = new_status.lower()

        cls._record_audit(
            admin_id=admin_id,
            target_user_id=target_user_id,
            action="CHANGE_STATUS",
            details={"old_status": old_status, "new_status": new_status.lower(), "reason": reason},
        )

        return {
            "success": True,
            "target_user_id": target_user_id,
            "previous_status": old_status,
            "current_status": new_status.lower(),
            "reason": reason,
        }

    @classmethod
    def purge_user_account(
        cls, admin_id: str, target_user_id: str, reason: str = "GDPR / User Right-to-be-Forgotten request"
    ) -> Dict[str, Any]:
        """Permanently deletes user account, cascading across profiles and custom intakes."""
        cls._seed_defaults()

        if target_user_id not in cls._profiles:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User account with ID '{target_user_id}' does not exist.",
            )

        # Protect root admin from accidental self-deletion
        if cls._profiles[target_user_id].get("role") == "admin":
            admin_count = sum(1 for p in cls._profiles.values() if p.get("role") == "admin")
            if admin_count <= 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot purge the sole platform administrator account.",
                )

        purged_email = cls._profiles[target_user_id]["email"]

        # Cascading deletion
        del cls._profiles[target_user_id]
        if target_user_id in cls._intakes:
            del cls._intakes[target_user_id]

        cls._record_audit(
            admin_id=admin_id,
            target_user_id=target_user_id,
            action="DELETE_USER",
            details={"purged_email": purged_email, "reason": reason},
        )

        return {
            "success": True,
            "purged_user_id": target_user_id,
            "purged_email": purged_email,
            "message": f"User account '{purged_email}' and all associated clinical intake vectors permanently purged.",
        }

    @classmethod
    def get_custom_intake(cls, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves user's customized clinical intake and rescue protocol preferences."""
        cls._seed_defaults()
        return cls._intakes.get(user_id)

    @classmethod
    def save_custom_intake(
        cls,
        user_id: str,
        email: str,
        form_values: Dict[str, Any],
        aura_patterns: List[str],
        customized_protocol: Optional[Dict[str, Any]] = None,
        aura_progression_notes: Optional[str] = None,
        gst_timestamp: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Saves or updates custom diagnostic questionnaire and tailored rescue protocol."""
        cls._seed_defaults()

        now = datetime.now(timezone.utc).isoformat()

        # Ensure user profile exists
        if user_id not in cls._profiles:
            cls._profiles[user_id] = {
                "id": user_id,
                "email": email,
                "role": "user",
                "status": "active",
                "created_at": now,
                "last_sign_in_at": now,
                "moh_days": 0,
            }

        intake_record = {
            "user_id": user_id,
            "email": email,
            "form_values": form_values,
            "aura_patterns": aura_patterns,
            "customized_protocol": customized_protocol or {},
            "aura_progression_notes": aura_progression_notes or "",
            "gst_timestamp": gst_timestamp or now,
            "updated_at": now,
        }

        cls._intakes[user_id] = intake_record
        return intake_record

    @classmethod
    def list_audit_logs(cls, limit: int = 50) -> List[Dict[str, Any]]:
        """Returns recent administrative audit logs."""
        return cls._audit_logs[-limit:]

    @classmethod
    def _record_audit(cls, admin_id: str, target_user_id: Optional[str], action: str, details: Dict[str, Any]):
        """Appends an immutable audit log entry."""
        log_entry = {
            "id": str(uuid.uuid4()),
            "admin_id": admin_id,
            "target_user_id": target_user_id,
            "action": action,
            "details": details,
            "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        }
        cls._audit_logs.append(log_entry)
