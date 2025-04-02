import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.models import User


@pytest.mark.asyncio
async def test_create_user(client: TestClient, db: AsyncIOMotorDatabase) -> None:
    # Test user creation endpoint
    response = client.post(
        f"{settings.API_V1_STR}/private/users/",
        json={
            "email": "pollo@listo.com",
            "password": "password123",
            "full_name": "Pollo Listo",
        },
    )

    assert response.status_code == 200
    data = response.json()

    # Verify user was created in MongoDB
    user = await db.users.find_one({"_id": data["id"]})
    assert user is not None
    assert user["email"] == "pollo@listo.com"
    assert user["full_name"] == "Pollo Listo"
    assert "hashed_password" in user  # Verify password was hashed
