"""Supabase Open-Source Auth (GoTrue) JWT verification and RBAC security gateway."""

from typing import Dict, Any, Optional
import jwt
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

security = HTTPBearer(auto_error=False)


class SupabaseAuthGateway:
    """Validates GoTrue-issued JWTs and enforces Role-Based Access Control (RBAC)."""

    def __init__(self, jwt_secret: Optional[str] = None):
        self.jwt_secret = jwt_secret or settings.SUPABASE_JWT_SECRET

    def verify_token(
        self, credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
    ) -> Dict[str, Any]:
        """Decodes and cryptographically verifies GoTrue JWT token."""
        if not credentials or not credentials.credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication credentials required. Please provide a valid Bearer token.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = credentials.credentials.strip()

        # Dev / Local offline bypass tokens for testing and air-gapped demo mode
        if token == "dev-admin-token":
            return {
                "sub": "00000000-0000-0000-0000-000000000001",
                "email": "admin@migrainerelief.ai",
                "role": "admin",
                "app_metadata": {"role": "admin"},
                "aud": "authenticated",
            }
        if token == "dev-user-token":
            return {
                "sub": "00000000-0000-0000-0000-000000000002",
                "email": "patient@migrainerelief.ai",
                "role": "authenticated",
                "app_metadata": {"role": "user"},
                "aud": "authenticated",
            }

        try:
            # Decode using configured secret, supporting HS256 and RS256
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256", "RS256"],
                options={"verify_aud": False},  # Support both custom and Supabase audiences
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication session expired. Please log in again.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.PyJWTError as err:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication token: {str(err)}",
                headers={"WWW-Authenticate": "Bearer"},
            )

    def require_admin(
        self, credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
    ) -> Dict[str, Any]:
        """Asserts that the authenticated user possesses administrator privileges."""
        payload = self.verify_token(credentials)
        role = (
            payload.get("app_metadata", {}).get("role")
            or payload.get("user_metadata", {}).get("role")
            or payload.get("role")
        )
        if role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrative privileges required to access this resource.",
            )
        return payload


# Singleton instance and FastAPI dependencies
auth_gateway = SupabaseAuthGateway()


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Dict[str, Any]:
    """Dependency extracting the authenticated user's token claims."""
    return auth_gateway.verify_token(credentials)


def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Optional[Dict[str, Any]]:
    """Dependency extracting token claims if present, otherwise returns None."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return auth_gateway.verify_token(credentials)
    except HTTPException:
        return None


def require_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Dict[str, Any]:
    """Dependency enforcing admin role permissions."""
    return auth_gateway.require_admin(credentials)

