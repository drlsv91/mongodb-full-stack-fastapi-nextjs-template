from motor.motor_asyncio import AsyncIOMotorDatabase
from app import crud
from app.models import Item, ItemCreate
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import random_lower_string


async def create_random_item(db: AsyncIOMotorDatabase) -> Item:
    # Create random user first
    user = await create_random_user(db)
    owner_id = user.id
    assert owner_id is not None

    # Generate random item data
    title = random_lower_string()
    description = random_lower_string()
    item_in = ItemCreate(title=title, description=description)

    # Create and return the item
    return await crud.create_item(db=db, item_in=item_in, owner_id=owner_id)
