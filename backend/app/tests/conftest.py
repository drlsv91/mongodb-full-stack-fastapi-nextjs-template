import pytest_asyncio
from typing import Generator
from fastapi.testclient import TestClient
from app.core.config import settings
from .mongo_client import MongoClient
from app.tests.utils.user import authentication_token_from_email
from app.tests.utils.utils import get_superuser_token_headers
from app.api.deps import get_db


@pytest_asyncio.fixture(scope="module")
async def db():
    print("\033[92mSetting test database db\033[0m")
    async with MongoClient("test_db", "sample_resources") as mongo_client:
        await mongo_client.hydrate_resources()
        yield mongo_client


@pytest_asyncio.fixture(scope="module")
def client(db) -> Generator[TestClient, None, None]:
    from app.main import app

    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:

        yield c
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest_asyncio.fixture(scope="module")
async def normal_user_token_headers(client: TestClient, db) -> dict[str, str]:
    return await authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )
