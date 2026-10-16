"""Tests for open-source GoTrue authentication endpoints (SRP-alohamora/supabase-opensrc-auth)."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_personas_endpoint():
    """Verify demo clinical research personas are returned for one-click testing."""
    response = client.get("/api/v1/auth/personas")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    emails = [p["email"] for p in data]
    assert "admin@migrainerelief.ai" in emails
    assert "alexa@school.edu" in emails
    assert "claire@corp.org" in emails


def test_anonymous_guest_session():
    """Verify ephemeral zero-PII guest token generation."""
    response = client.post("/api/v1/auth/anonymous", json={"guest_name": "ephemeral_guest_42"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "ephemeral_guest_42" in data["user"]["email"]
    assert data["user"]["is_anonymous"] is True


def test_signup_and_duplicate_prevention():
    """Verify user registration and 409 conflict on duplicate email."""
    signup_payload = {
        "email": "clinical_trialist_2026@neurology.org",
        "password": "SecurePassword123!",
        "role": "user",
        "persona": "Clinical Investigator",
        "display_name": "Investigator_2026",
    }
    response = client.post("/api/v1/auth/signup", json=signup_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "clinical_trialist_2026@neurology.org"
    assert data["user"]["role"] == "user"
    assert "access_token" in data

    # Attempt duplicate signup -> should return 409 Conflict
    dup_res = client.post("/api/v1/auth/signup", json=signup_payload)
    assert dup_res.status_code == 409
    assert "already exists" in dup_res.json()["detail"]


def test_login_seed_and_registered_users():
    """Verify login authentication for seed and registered accounts."""
    # Seed account: Alexa
    alexa_res = client.post(
        "/api/v1/auth/login",
        json={"email": "alexa@school.edu", "password": "password"},
    )
    assert alexa_res.status_code == 200
    alexa_data = alexa_res.json()
    assert alexa_data["user"]["email"] == "alexa@school.edu"
    assert "access_token" in alexa_data

    # Registered account from previous test
    reg_res = client.post(
        "/api/v1/auth/login",
        json={"email": "clinical_trialist_2026@neurology.org", "password": "SecurePassword123!"},
    )
    assert reg_res.status_code == 200
    assert reg_res.json()["user"]["email"] == "clinical_trialist_2026@neurology.org"

    # Invalid password
    bad_res = client.post(
        "/api/v1/auth/login",
        json={"email": "alexa@school.edu", "password": "wrongpassword"},
    )
    assert bad_res.status_code == 401


def test_auth_me_protected_endpoint():
    """Verify /me profile retrieval with Bearer token validation."""
    # Unauthorized without token
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code == 401

    # Login to obtain token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "alexa@school.edu", "password": "password"},
    )
    token = login_res.json()["access_token"]

    # Authorized with Bearer token
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["authenticated"] is True
    assert me_data["profile"]["email"] == "alexa@school.edu"
    assert me_data["custom_intake"] is not None


def test_magic_link_flow():
    """Verify passwordless magic link token generation and sign in."""
    magic_res = client.post("/api/v1/auth/magic-link", json={"email": "magic_user@clinic.io"})
    assert magic_res.status_code == 200
    magic_data = magic_res.json()
    assert magic_data["user"]["email"] == "magic_user@clinic.io"
    assert "access_token" in magic_data


def test_breakglass_admin_login_and_mfa():
    """Verify admin007 breakglass login triggers MFA, and MFA verification succeeds."""
    # 1. Login with breakglass username & password without MFA code
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin007", "password": "admin10102011"},
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert login_data["mfa_required"] is True
    assert login_data["user"]["role"] == "admin"
    assert login_data["demo_mfa_code"] == "007700"

    # 2. MFA verification with incorrect passcode -> 401
    bad_mfa = client.post(
        "/api/v1/auth/mfa/verify",
        json={"user_id_or_email": "admin007", "mfa_code": "999999"},
    )
    assert bad_mfa.status_code == 401

    # 3. MFA verification with valid passcode 007700 -> Issues Admin JWT
    good_mfa = client.post(
        "/api/v1/auth/mfa/verify",
        json={"user_id_or_email": "admin007", "mfa_code": "007700"},
    )
    assert good_mfa.status_code == 200
    mfa_data = good_mfa.json()
    assert mfa_data["mfa_verified"] is True
    assert mfa_data["user"]["role"] == "admin"
    assert "access_token" in mfa_data
    admin_token = mfa_data["access_token"]

    # 4. Access admin user directory with the verified admin token
    users_res = client.get(
        "/api/v1/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert users_res.status_code == 200
    users_data = users_res.json()
    assert users_data["total"] >= 3
    emails = [u["email"] for u in users_data["accounts"]]
    assert "admin007@migrainerelief.ai" in emails

    # 5. Direct login with mfa_code in payload also succeeds
    direct_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin007", "password": "admin10102011", "mfa_code": "007700"},
    )
    assert direct_res.status_code == 200
    assert direct_res.json()["mfa_verified"] is True
    assert "access_token" in direct_res.json()


def test_admin_user_reset_and_delete():
    """Verify administrator can reset user password and delete user accounts."""
    # Obtain admin token for admin007
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin007", "password": "admin10102011", "mfa_code": "007700"},
    )
    admin_token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create a test patient account to delete and reset
    reg_res = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "user_to_be_managed@clinic.org",
            "password": "PasswordToReset123!",
            "role": "user",
        },
    )
    target_id = reg_res.json()["user"]["id"]

    # 1. Reset password
    reset_res = client.post(f"/api/v1/admin/users/{target_id}/reset-password", headers=headers)
    assert reset_res.status_code == 200
    assert "temporary_password" in reset_res.json()
    assert "recovery_url" in reset_res.json()

    # 2. Delete user
    delete_res = client.delete(f"/api/v1/admin/users/{target_id}", headers=headers)
    assert delete_res.status_code == 200
    assert delete_res.json()["success"] is True

    # 3. Verify user is no longer in users list
    users_res = client.get("/api/v1/admin/users", headers=headers)
    emails = [u["email"] for u in users_res.json()["accounts"]]
    assert "user_to_be_managed@clinic.org" not in emails


def test_registered_users_for_immediate_relief():
    """Verify all registered accounts are available with clean display names."""
    res = client.get("/api/v1/auth/registered-users")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    names = [u["name"] for u in data]
    assert "Claire" in names
    assert "Alexa" in names
    assert "Administrator" in names
    assert "admin007" in names


def test_verify_profile_password():
    """Verify password checks for registered user profiles."""
    # Correct password for Claire
    res_ok = client.post(
        "/api/v1/auth/verify-profile-password",
        json={"user_id": "claire", "password": "claire"},
    )
    assert res_ok.status_code == 200
    assert res_ok.json()["verified"] is True

    # Correct password for Admin
    admin_ok = client.post(
        "/api/v1/auth/verify-profile-password",
        json={"user_id": "admin", "password": "admin123"},
    )
    assert admin_ok.status_code == 200
    assert admin_ok.json()["verified"] is True

    # Incorrect password returns 401
    res_err = client.post(
        "/api/v1/auth/verify-profile-password",
        json={"user_id": "claire", "password": "wrongpassword"},
    )
    assert res_err.status_code == 401

