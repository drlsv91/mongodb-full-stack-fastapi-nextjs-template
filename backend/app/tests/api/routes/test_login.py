import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.security import verify_password
from app.crud import create_user
from app.models import UserCreate
from app.tests.utils.user import user_authentication_headers
from app.tests.utils.utils import random_email, random_lower_string
from app.utils import generate_password_reset_token


def test_get_access_token(client: TestClient) -> None:
    """Test obtaining access token with valid credentials"""
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    tokens = response.json()
    assert response.status_code == 200
    assert "access_token" in tokens
    assert tokens["access_token"]


def test_get_access_token_incorrect_password(client: TestClient) -> None:
    """Test failed login with incorrect password"""
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": "incorrect",
    }
    response = client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    assert response.status_code == 400


def test_use_access_token(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    """Test token validation endpoint"""
    response = client.post(
        f"{settings.API_V1_STR}/login/test-token",
        headers=superuser_token_headers,
    )
    result = response.json()
    assert response.status_code == 200
    assert "email" in result


@pytest.mark.asyncio
async def test_recovery_password(client: TestClient, db: AsyncIOMotorDatabase) -> None:
    """Test password recovery email sending"""
    with (
        patch("app.core.config.settings.SMTP_HOST", "smtp.example.com"),
        patch("app.core.config.settings.SMTP_USER", "admin@example.com"),
    ):
        # First create a test user
        email = "test@example.com"
        password = random_lower_string()
        user = await create_user(
            db=db,
            user_create=UserCreate(email=email, password=password, is_active=True),
        )

        # Test recovery endpoint
        response = client.post(f"{settings.API_V1_STR}/password-recovery/{email}")
        assert response.status_code == 200
        assert response.json() == {"message": "Password recovery email sent"}


def test_recovery_password_user_not_exists(client: TestClient) -> None:
    """Test recovery for non-existent user"""
    email = "nonexistent@example.com"
    response = client.post(f"{settings.API_V1_STR}/password-recovery/{email}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_reset_password(client: TestClient, db: AsyncIOMotorDatabase) -> None:
    """Test password reset flow"""
    email = random_email()
    password = random_lower_string()
    new_password = random_lower_string()

    # Create test user
    user = await create_user(
        db=db, user_create=UserCreate(email=email, password=password, is_active=True)
    )

    # Generate valid reset token
    token = generate_password_reset_token(email=email)

    # Get auth headers
    headers = user_authentication_headers(client=client, email=email, password=password)

    # Test reset endpoint
    response = client.post(
        f"{settings.API_V1_STR}/reset-password/",
        headers=headers,
        json={"new_password": new_password, "token": token},
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Password updated successfully"}

    # Verify password was updated in MongoDB
    updated_user = await db.users.find_one({"email": email})
    assert verify_password(new_password, updated_user["hashed_password"])


def test_reset_password_invalid_token(client: TestClient) -> None:
    """Test password reset with invalid token"""
    data = {"new_password": "newpassword", "token": "invalid"}
    response = client.post(
        f"{settings.API_V1_STR}/reset-password/",
        json=data,
    )
    result = response.json()
    assert response.status_code == 400
    assert result["detail"] == "Invalid token"
