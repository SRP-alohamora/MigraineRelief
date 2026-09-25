"""
Test suite validating the 2026 Migraine Medication & Neuromodulation Therapy Intelligence
specifications, PRD requirements, implementation plan, and frontend architecture.
"""
import os
import re
from pathlib import Path


REPO_ROOT = Path(__file__).parent.parent


def test_prd_medications_section():
    """Verify PRD.md contains the comprehensive Section 13 for Medications & Neuromodulation."""
    prd_path = REPO_ROOT / "PRD.md"
    assert prd_path.exists(), "PRD.md must exist in root"
    content = prd_path.read_text(encoding="utf-8")

    # Section 13 title
    assert "## 13. Comprehensive Medication & Neuromodulation Therapy Intelligence (`/medications`)" in content

    # Key clinical concepts from user request and validated literature
    assert "Zavegepant" in content or "Zavzpret" in content
    assert "Rimegepant" in content or "Nurtec" in content
    assert "Ubrelvy" in content
    assert "Qulipta" in content
    assert "Lasmiditan" in content or "Reyvow" in content
    assert "CGRP" in content
    assert "ditans" in content or "Ditans" in content
    assert "gepants" in content or "Gepants" in content
    assert "Bocunebart" in content or "Lu AG09222" in content
    assert "PACAP" in content
    assert "PROCEED" in content

    # Neuromodulation FDA Categories
    assert "Cefaly" in content
    assert "Nerivio" in content
    assert "gammaCore" in content
    assert "Relivion" in content
    assert "SAVI Dual" in content or "SpringTMS" in content
    assert "FDA Approved" in content
    assert "FDA Approval Pending" in content
    assert "Allay Lamp" in content

    # OTC, supplements & Acupressure
    assert "Excedrin Migraine" in content
    assert "Magnesium" in content
    assert "Riboflavin" in content
    assert "Coenzyme Q10" in content or "CoQ10" in content
    assert "Hegu" in content or "LI4" in content
    assert "Neiguan" in content or "PC6" in content
    assert "GB20" in content or "Fengchi" in content
    assert "Acupuncture" in content

    # Validated external URLs
    assert "https://advancedspineandpain.com/2026/04/26/best-migraine-medications/" in content
    assert "https://losaltosneurology.com/2026/08/09/migraine-treatment-in-2026-cgrp-prevention-new-therapies/" in content


def test_implementation_medications_section():
    """Verify implementation.md contains Section 14 specifying the frontend implementation."""
    impl_path = REPO_ROOT / "implementation.md"
    assert impl_path.exists(), "implementation.md must exist in root"
    content = impl_path.read_text(encoding="utf-8")

    assert "## 14. Frontend Medication & Neuromodulation Therapy Implementation Specification (`/medications`)" in content
    assert "MedicationKnowledgeTile.tsx" in content
    assert "MedicationsTab.tsx" in content
    assert "WebMDNavbar.tsx" in content
    assert "TreatmentItem" in content
    assert "https://www.cefaly.com" in content
    assert "https://nerivio.com" in content


def test_frontend_navbar_tab_order():
    """Verify that WebMDNavbar strictly places Medications next to News, before Research Papers."""
    navbar_path = REPO_ROOT / "frontend" / "src" / "components" / "WebMDNavbar.tsx"
    assert navbar_path.exists(), "WebMDNavbar.tsx must exist"
    content = navbar_path.read_text(encoding="utf-8")

    # Check NavRoute type
    assert "'/medications'" in content

    # Check tab ordering in desktop nav: News -> Medications -> Research Papers
    news_idx = content.find("handleRouteClick('/news')")
    meds_idx = content.find("handleRouteClick('/medications')")
    research_idx = content.find("handleRouteClick('/research')")

    assert news_idx != -1, "News tab must exist"
    assert meds_idx != -1, "Medications tab must exist"
    assert research_idx != -1, "Research Papers tab must exist"
    assert news_idx < meds_idx < research_idx, (
        f"Medications tab must be strictly placed after News and before Research Papers. "
        f"Indices: news={news_idx}, meds={meds_idx}, research={research_idx}"
    )


def test_frontend_homepage_and_routing():
    """Verify App.tsx mounts MedicationKnowledgeTile on home page and handles /medications route."""
    app_path = REPO_ROOT / "frontend" / "src" / "App.tsx"
    assert app_path.exists(), "App.tsx must exist"
    content = app_path.read_text(encoding="utf-8")

    assert "MedicationKnowledgeTile" in content
    assert "MedicationsTab" in content
    assert "currentRoute === '/medications'" in content
    assert "navigateTo('/medications')" in content


def test_medications_tab_clinical_catalog():
    """Verify MedicationsTab contains required pharmacopeial data and FDA device categorizations."""
    meds_tab_path = REPO_ROOT / "frontend" / "src" / "components" / "MedicationsTab.tsx"
    assert meds_tab_path.exists(), "MedicationsTab.tsx must exist"
    content = meds_tab_path.read_text(encoding="utf-8")

    # CGRP breakthroughs
    assert "Zavzpret" in content
    assert "Nurtec ODT" in content
    assert "Qulipta" in content
    assert "Ubrelvy" in content
    assert "Aimovig" in content
    assert "Ajovy" in content
    assert "Reyvow" in content

    # Devices & FDA categories
    assert "fda-approved" in content
    assert "approval-pending" in content
    assert "not-applied" in content
    assert "https://www.cefaly.com" in content
    assert "https://nerivio.com" in content
    assert "https://www.gammacore.com" in content
    assert "https://www.relivion.com" in content
    assert "https://www.eneura.com" in content
    assert "allaylamp.com" in content

    # Experimental drug
    assert "Lu AG09222" in content
    assert "PROCEED" in content
    assert "PACAP" in content

    # Acupressure
    assert "Hegu" in content
    assert "Neiguan" in content
    assert "Fengchi" in content
    assert "Yin Tang" in content
