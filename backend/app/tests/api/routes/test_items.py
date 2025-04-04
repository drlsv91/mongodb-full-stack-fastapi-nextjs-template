import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.tests.utils.item import create_random_item
from bson import ObjectId


@pytest.mark.asyncio
async def test_create_item(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:

    data = {"title": "Foo", "description": "Fighters"}
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert "_id" in content
    assert "owner_id" in content


@pytest.mark.asyncio
async def test_read_item(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    item = await create_random_item(db)
    response = client.get(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == item.title
    assert content["description"] == item.description
    assert content["_id"] == str(item.id)
    assert content["owner_id"] == str(item.owner_id)


def test_read_item_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/items/{ObjectId()}",
        headers=superuser_token_headers,
    )

    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Item not found"


@pytest.mark.asyncio
async def test_read_item_not_enough_permissions(
    client: TestClient,
    normal_user_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    item = await create_random_item(db)
    response = client.get(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not enough permissions"


@pytest.mark.asyncio
async def test_read_items(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    await create_random_item(db)
    await create_random_item(db)
    response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2


@pytest.mark.asyncio
async def test_update_item(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    item = await create_random_item(db)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["_id"] == str(item.id)
    assert content["owner_id"] == str(item.owner_id)


def test_update_item_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{ObjectId()}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Item not found"


@pytest.mark.asyncio
async def test_update_item_not_enough_permissions(
    client: TestClient,
    normal_user_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    item = await create_random_item(db)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not enough permissions"


@pytest.mark.asyncio
async def test_delete_item(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    item = await create_random_item(db)
    response = client.delete(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Item deleted successfully"


def test_delete_item_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/items/{ObjectId()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Item not found"


@pytest.mark.asyncio
async def test_delete_item_not_enough_permissions(
    client: TestClient,
    normal_user_token_headers: dict[str, str],
    db: AsyncIOMotorDatabase,
) -> None:
    item = await create_random_item(db)
    response = client.delete(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    content = response.json()
    assert content["detail"] == "Not enough permissions"
