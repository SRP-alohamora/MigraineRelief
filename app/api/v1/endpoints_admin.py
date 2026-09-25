"""Administrative management endpoints for platform user governance, password resets, and account lifecycle."""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.auth.supabase_gateway import require_admin, get_current_user
from app.admin.account_service import AdminAccountService

router = APIRouter(prefix="/admin", tags=["Administrative Governance"])


class ResetPasswordRequest(BaseModel):
    """Payload for administrative password reset and recovery generation."""

    temporary_password: Optional[str] = Field(
        default=None,
        description="Optional temporary password to set; if omitted, a secure one is generated automatically.",
    )


class ChangeStatusRequest(BaseModel):
    """Payload for updating user account lifecycle status."""

    status: str = Field(..., description="Target status: 'active', 'suspended', or 'archived'")
    reason: str = Field(default="Administrative update", description="Audit reason for status transition")


class PurgeAccountRequest(BaseModel):
    """Payload for permanent account deletion."""

    reason: str = Field(
        default="User right-to-be-forgotten / Administrative purge",
        description="Justification for cascading deletion",
    )


@router.get("/users", summary="List and filter all platform accounts")
async def list_users(
    search: Optional[str] = Query(None, description="Search query matching email or user ID"),
    status_filter: Optional[str] = Query("all", alias="status", description="Status filter: all, active, suspended, archived"),
    profile_filter: Optional[str] = Query("all", alias="profile", description="Profile filter: all, configured, pending"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    admin: Dict[str, Any] = Depends(require_admin),
):
    """Lists platform accounts with pagination, clinical intake indicators, and status filtering."""
    return AdminAccountService.list_all_accounts(
        search=search,
        status_filter=status_filter,
        profile_filter=profile_filter,
        page=page,
        limit=limit,
    )


@router.post("/users/{user_id}/reset-password", summary="Reset user password / issue recovery link")
async def reset_password(
    user_id: str,
    payload: Optional[ResetPasswordRequest] = None,
    admin: Dict[str, Any] = Depends(require_admin),
):
    """Generates a password recovery URL and secure temporary credentials for the target account."""
    temp_pwd = payload.temporary_password if payload else None
    return AdminAccountService.reset_user_password(
        admin_id=admin.get("sub", "admin"),
        target_user_id=user_id,
        custom_temp_password=temp_pwd,
    )


@router.post("/users/{user_id}/status", summary="Change account status (active, suspended, archived)")
async def update_account_status(
    user_id: str,
    payload: ChangeStatusRequest,
    admin: Dict[str, Any] = Depends(require_admin),
):
    """Transitions a user account between active, suspended, and soft-archived states."""
    return AdminAccountService.set_user_status(
        admin_id=admin.get("sub", "admin"),
        target_user_id=user_id,
        new_status=payload.status,
        reason=payload.reason,
    )


@router.delete("/users/{user_id}", summary="Permanently delete user account and clinical data")
async def delete_account(
    user_id: str,
    reason: Optional[str] = Query("Administrative purge", description="Reason for deletion"),
    admin: Dict[str, Any] = Depends(require_admin),
):
    """Permanently purges a user account, cascading across profiles and clinical intake vectors."""
    return AdminAccountService.purge_user_account(
        admin_id=admin.get("sub", "admin"),
        target_user_id=user_id,
        reason=reason or "Administrative purge",
    )


@router.get("/users/{user_id}/intake", summary="View customized clinical intake for user")
async def get_user_intake(
    user_id: str,
    admin: Dict[str, Any] = Depends(require_admin),
):
    """Inspects the patient's customized 24-feature intake, aura patterns, and rescue protocols."""
    intake = AdminAccountService.get_custom_intake(user_id)
    if not intake:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No customized clinical intake on record for user '{user_id}'.",
        )
    return intake


@router.get("/audit-logs", summary="Inspect administrative action audit log")
async def get_audit_logs(
    limit: int = Query(50, ge=1, le=200, description="Max entries to return"),
    admin: Dict[str, Any] = Depends(require_admin),
):
    """Retrieves immutable audit trail of password resets, status changes, and purge actions."""
    return {
        "total_records": len(AdminAccountService.list_audit_logs(limit=limit)),
        "logs": AdminAccountService.list_audit_logs(limit=limit),
    }
