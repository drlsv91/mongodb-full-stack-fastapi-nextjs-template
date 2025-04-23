from motor.motor_asyncio import AsyncIOMotorDatabase
from app import crud
from app.core.config import settings
from app.models import UserCreate, User


async def init_db(db: AsyncIOMotorDatabase) -> None:
    # Check if superuser exists
    user = await User.find_by_email(db, settings.FIRST_SUPERUSER)

    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )

        await crud.create_user(db=db, user_create=user_in)
