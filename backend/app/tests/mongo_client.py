from mongomock_motor import AsyncMongoMockClient
import logging
from bson import ObjectId
from app.models import User
from app.core.security import get_password_hash
from app.core.config import settings


class MongoHandler:
    def __init__(self, db_name: str, collection_name: str):
        self.__db_name = db_name
        self.__collection_name = collection_name
        self.__db_client = AsyncMongoMockClient()

    def __getattr__(self, name: str):
        """
        Allows access like db.users, db.items, etc.
        Equivalent to: self.__db_client[self.__db_name][name]
        """
        return self.__db_client[self.__db_name][name]

    async def get_sample_resource(self, resource_id: ObjectId):
        return await self.__db_client[self.__db_name][self.__collection_name].find_one(
            {"_id": ObjectId(resource_id)}
        )

    async def hydrate_resources(self):
        # hydrate users
        self.__collection_name = "users"
        superuser_email = settings.FIRST_SUPERUSER
        existing = await self.get_sample_resource_by_email(superuser_email)
        if not existing:
            user = User(
                email=superuser_email,
                full_name="Test Superuser",
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                is_superuser=True,
                is_active=True,
            )
            await self.insert_sample_resource(user.model_dump())

    async def get_sample_resource_by_email(self, email: str):
        return await self.__db_client[self.__db_name][self.__collection_name].find_one(
            {"email": email}
        )

    async def insert_sample_resource(self, sample_resource: dict):
        await self.__db_client[self.__db_name][self.__collection_name].insert_one(
            sample_resource
        )

    async def drop_database(self):
        await self.__db_client.drop_database(self.__db_name)

    def close_conn(self):
        self.__db_client.close()


class MongoClient:
    def __init__(self, db_name: str, collection_name: str):
        self.__db_handler = MongoHandler(db_name, collection_name)

    async def __aenter__(self):

        return self.__db_handler

    async def __aexit__(self, exception_type, exception_value, exception_traceback):
        if exception_type:
            logging.error(exception_value)

        await self.__db_handler.drop_database()
        self.__db_handler.close_conn()
        return False
