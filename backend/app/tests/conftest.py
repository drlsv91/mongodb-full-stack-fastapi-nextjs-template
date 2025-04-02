import pytest
from typing import Generator
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.main import app
from app.tests.utils.user import authentication_token_from_email
from app.tests.utils.utils import get_superuser_token_headers
from app.core.db import init_db


@pytest.fixture(scope="session")
def mongo_client() -> Generator[AsyncIOMotorClient, None, None]:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    yield client
    client.close()


@pytest.fixture(scope="function", autouse=True)
async def db(mongo_client: AsyncIOMotorClient) -> AsyncIOMotorClient:
    db = mongo_client[settings.MONGODB_DB_NAME]
    # Initialize test data
    await init_db(db)

    yield db

    # Clean up after each test
    await db.users.delete_many({})
    await db.items.delete_many({})


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
async def normal_user_token_headers(
    client: TestClient, db: AsyncIOMotorClient
) -> dict[str, str]:
    return await authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )
