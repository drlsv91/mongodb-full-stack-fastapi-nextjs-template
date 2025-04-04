import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from bson import ObjectId


@pytest.mark.asyncio
async def test_create_user(client: TestClient, db: AsyncIOMotorDatabase) -> None:

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

    user = await db.users.find_one({"_id": ObjectId(data["_id"])})

    assert user is not None
    assert user["email"] == "pollo@listo.com"
    assert user["full_name"] == "Pollo Listo"

    assert "hashed_password" in user
