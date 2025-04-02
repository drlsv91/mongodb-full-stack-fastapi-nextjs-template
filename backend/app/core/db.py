from motor.motor_asyncio import AsyncIOMotorDatabase
from app import crud
from app.core.config import settings
from app.models import UserCreate


async def init_db(db: AsyncIOMotorDatabase) -> None:
    # Check if superuser exists
    user = await db.users.find_one({"email": settings.FIRST_SUPERUSER})

    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )

        await crud.create_user(db=db, user_create=user_in)
