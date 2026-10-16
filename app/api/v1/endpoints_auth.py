"""Open-source GoTrue authentication endpoints leveraging SRP-alohamora/supabase-opensrc-auth semantics."""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.supabase_gateway import get_current_user
from app.admin.account_service import AdminAccountService

router = APIRouter(prefix="/auth", tags=["Open-Source Supabase Authentication"])


class SignupRequest(BaseModel):
    """Payload for registering a new user account."""

    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="Account password (min 6 characters)")
    role: Optional[str] = Field(default="user", description="Account role: 'user' or 'admin'")
    persona: Optional[str] = Field(default="Standard Patient", description="Clinical persona classification")
    display_name: Optional[str] = Field(default=None, description="Optional public display handle (Zero-PII)")


class LoginRequest(BaseModel):
    """Payload for user sign in."""

    email: str = Field(..., description="User email address or UUID")
    password: str = Field(..., description="Account password")
    mfa_code: Optional[str] = Field(default=None, description="Optional 6-digit TOTP MFA code for administrator accounts")


class MfaVerifyRequest(BaseModel):
    """Payload for verifying 6-digit administrative MFA challenge."""

    user_id_or_email: str = Field(..., description="User ID, username, or email")
    mfa_code: str = Field(..., min_length=6, max_length=6, description="6-digit TOTP security code")


class MagicLinkRequest(BaseModel):
    """Payload for passwordless magic-link sign in."""

    email: str = Field(..., description="User email address")


class AnonymousSessionRequest(BaseModel):
    """Payload for creating an ephemeral zero-PII guest session."""

    guest_name: Optional[str] = Field(default=None, description="Optional custom guest handle")


class AuthTokenResponse(BaseModel):
    """Response containing GoTrue JWT session tokens, user profile, and optional MFA challenge."""

    user: Optional[Dict[str, Any]] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"
    expires_in: Optional[int] = 604800
    display_name: Optional[str] = None
    magic_link_verified: Optional[bool] = None
    mfa_required: Optional[bool] = False
    demo_mfa_code: Optional[str] = None
    message: Optional[str] = None
    mfa_verified: Optional[bool] = False


@router.post("/signup", response_model=AuthTokenResponse, summary="Register user account via GoTrue engine")
async def signup(payload: SignupRequest):
    """Creates a new user profile with GoTrue JWT authentication and zero per-seat licensing."""
    return AdminAccountService.register_user(
        email=payload.email,
        password=payload.password,
        role=payload.role or "user",
        persona=payload.persona,
        display_name=payload.display_name,
    )


@router.post("/login", response_model=AuthTokenResponse, summary="Authenticate user credentials")
async def login(payload: LoginRequest):
    """Authenticates user credentials and issues a GoTrue-compatible HS256 JWT session token or requests MFA."""
    return AdminAccountService.authenticate_user(
        email=payload.email,
        password=payload.password,
        mfa_code=payload.mfa_code,
    )


@router.post("/mfa/verify", response_model=AuthTokenResponse, summary="Verify Admin MFA 6-digit passcode")
async def verify_mfa(payload: MfaVerifyRequest):
    """Verifies secondary MFA passcode for administrator accounts and issues elevated GoTrue JWT."""
    return AdminAccountService.verify_admin_mfa(
        user_id_or_email=payload.user_id_or_email,
        mfa_code=payload.mfa_code,
    )


@router.post("/magic-link", response_model=AuthTokenResponse, summary="Passwordless magic-link sign-in")
async def magic_link(payload: MagicLinkRequest):
    """Sends or auto-verifies a passwordless magic-link authentication session."""
    return AdminAccountService.create_magic_link_session(email=payload.email)


@router.post("/anonymous", response_model=AuthTokenResponse, summary="Create ephemeral zero-PII guest session")
async def anonymous_session(payload: Optional[AnonymousSessionRequest] = None):
    """Provisions an isolated anonymous guest session with ephemeral cryptographic credentials."""
    name = payload.guest_name if payload else None
    return AdminAccountService.create_anonymous_session(guest_name=name)


@router.get("/me", summary="Get current authenticated user profile and clinical state")
async def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    """Validates the Bearer JWT and returns the current user profile along with custom intake vectors."""
    user_id = user.get("sub")
    profile = AdminAccountService.get_user_by_id(user_id) if user_id else None
    custom_intake = AdminAccountService.get_custom_intake(user_id) if user_id else None

    return {
        "authenticated": True,
        "token_claims": user,
        "profile": profile,
        "custom_intake": custom_intake,
    }


@router.get("/personas", summary="List pre-seeded clinical research personas")
async def list_personas():
    """Returns pre-configured demo clinical research personas for one-click testing."""
    return AdminAccountService.get_demo_personas()


class VerifyProfilePasswordRequest(BaseModel):
    user_id: str = Field(..., description="User ID, handle, or key (e.g. claire, alexa, admin)")
    password: str = Field(..., description="Password to verify")


@router.get("/registered-users", summary="List all active registered users for clinical rescue")
async def list_registered_users():
    """Returns all registered active platform accounts with clean display names."""
    return AdminAccountService.get_registered_users()


@router.post("/verify-profile-password", summary="Verify password for a registered profile")
async def verify_profile_password(payload: VerifyProfilePasswordRequest):
    """Verifies credentials for profile authentication in acute relief modal."""
    is_valid = AdminAccountService.verify_user_password(payload.user_id, payload.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Incorrect password for profile '{payload.user_id}'.",
        )
    return {"verified": True, "user_id": payload.user_id}
