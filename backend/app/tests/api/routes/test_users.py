import uuid
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorDatabase
from app import crud
from app.core.config import settings
from app.core.security import verify_password
from app.models import UserCreate
from app.tests.utils.utils import random_email, random_lower_string


# Test for getting current user (superuser)
def test_get_users_superuser_me(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/users/me", headers=superuser_token_headers
    )
    current_user = response.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["is_superuser"]
    assert current_user["email"] == settings.FIRST_SUPERUSER


# Test for getting current user (normal user)
def test_get_users_normal_user_me(
    client: TestClient, normal_user_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/users/me", headers=normal_user_token_headers
    )
    current_user = response.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["is_superuser"] is False
    assert current_user["email"] == settings.EMAIL_TEST_USER


# Test creating new user with unique email
@pytest.mark.asyncio
async def test_create_user_new_email(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    with (
        patch("app.utils.send_email", return_value=None),
        patch("app.core.config.settings.SMTP_HOST", "smtp.example.com"),
        patch("app.core.config.settings.SMTP_USER", "admin@example.com"),
    ):
        username = random_email()
        password = random_lower_string()
        response = client.post(
            f"{settings.API_V1_STR}/users/",
            headers=superuser_token_headers,
            json={"email": username, "password": password},
        )
        assert 200 <= response.status_code < 300
        created_user = response.json()
        user = await db.users.find_one({"email": username})
        assert user
        assert user["email"] == created_user["email"]


# Test getting existing user
@pytest.mark.asyncio
async def test_get_existing_user(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    username = random_email()
    password = random_lower_string()
    user = await crud.create_user(
        db=db, user_create=UserCreate(email=username, password=password)
    )

    response = client.get(
        f"{settings.API_V1_STR}/users/{user.id}",
        headers=superuser_token_headers,
    )
    assert 200 <= response.status_code < 300
    api_user = response.json()
    existing_user = await db.users.find_one({"email": username})
    assert existing_user
    assert existing_user["email"] == api_user["email"]


# Test creating user with existing email
@pytest.mark.asyncio
async def test_create_user_existing_username(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    username = random_email()
    password = random_lower_string()
    await crud.create_user(
        db=db, user_create=UserCreate(email=username, password=password)
    )

    response = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
        json={"email": username, "password": password},
    )
    assert response.status_code == 400
    assert "_id" not in response.json()


# Test retrieving multiple users
@pytest.mark.asyncio
async def test_retrieve_users(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    # Create test users
    await crud.create_user(
        db=db,
        user_create=UserCreate(email=random_email(), password=random_lower_string()),
    )
    await crud.create_user(
        db=db,
        user_create=UserCreate(email=random_email(), password=random_lower_string()),
    )

    response = client.get(
        f"{settings.API_V1_STR}/users/", headers=superuser_token_headers
    )
    all_users = response.json()

    assert len(all_users["data"]) > 1
    assert "count" in all_users
    for item in all_users["data"]:
        assert "email" in item


# Test updating current user
@pytest.mark.asyncio
async def test_update_user_me(
    client: TestClient,
    normal_user_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    full_name = "Updated Name"
    email = random_email()
    response = client.patch(
        f"{settings.API_V1_STR}/users/me",
        headers=normal_user_token_headers,
        json={"full_name": full_name, "email": email},
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["email"] == email
    assert updated_user["full_name"] == full_name

    user_db = await db.users.find_one({"email": email})
    assert user_db
    assert user_db["email"] == email
    assert user_db["full_name"] == full_name


# Test user registration
@pytest.mark.asyncio
async def test_register_user(client: TestClient, db: AsyncIOMotorDatabase) -> None:
    username = random_email()
    password = random_lower_string()
    full_name = random_lower_string()
    response = client.post(
        f"{settings.API_V1_STR}/users/signup",
        json={"email": username, "password": password, "full_name": full_name},
    )
    assert response.status_code == 200
    created_user = response.json()

    user_db = await db.users.find_one({"email": username})
    assert user_db
    assert user_db["email"] == username
    assert user_db["full_name"] == full_name
    assert verify_password(password, user_db["hashed_password"])


# Test deleting user by superuser
@pytest.mark.asyncio
async def test_delete_user_super_user(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    user = await crud.create_user(
        db=db,
        user_create=UserCreate(email=random_email(), password=random_lower_string()),
    )

    response = client.delete(
        f"{settings.API_V1_STR}/users/{user.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    assert response.json()["message"] == "User deleted successfully"

    deleted_user = await db.users.find_one({"_id": user.id})
    assert deleted_user is None


# Test deleting non-existent user
def test_delete_user_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/users/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


# Test updating password
@pytest.mark.asyncio
async def test_update_password_me(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    new_password = random_lower_string()
    data = {
        "current_password": settings.FIRST_SUPERUSER_PASSWORD,
        "new_password": new_password,
    }
    response = client.patch(
        f"{settings.API_V1_STR}/users/me/password",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Password updated successfully"

    # Verify password was updated
    user = await db.users.find_one({"email": settings.FIRST_SUPERUSER})
    assert verify_password(new_password, user["hashed_password"])

    # Revert password
    old_data = {
        "current_password": new_password,
        "new_password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = client.patch(
        f"{settings.API_V1_STR}/users/me/password",
        headers=superuser_token_headers,
        json=old_data,
    )
    assert response.status_code == 200


# Test updating password with incorrect current password
def test_update_password_me_incorrect_password(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    new_password = random_lower_string()
    data = {"current_password": "wrongpassword", "new_password": new_password}
    response = client.patch(
        f"{settings.API_V1_STR}/users/me/password",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Incorrect password"


# Test updating user with existing email
@pytest.mark.asyncio
async def test_update_user_email_exists(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    # Create first user
    user1 = await crud.create_user(
        db=db,
        user_create=UserCreate(email=random_email(), password=random_lower_string()),
    )

    # Create second user
    user2 = await crud.create_user(
        db=db,
        user_create=UserCreate(email=random_email(), password=random_lower_string()),
    )

    # Try to update first user with second user's email
    response = client.patch(
        f"{settings.API_V1_STR}/users/{user1.id}",
        headers=superuser_token_headers,
        json={"email": user2.email},
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "User with this email already exists"
