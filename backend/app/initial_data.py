import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.db import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init() -> None:
    # Initialize MongoDB connection
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_db(db)


async def main() -> None:
    logger.info("Creating initial data")
    await init()
    logger.info("Initial data created")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
