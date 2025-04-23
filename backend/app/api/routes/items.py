from typing import Any
from fastapi import APIRouter, HTTPException, status
from app.api.deps import CurrentUser, DbDep
from app.models import (
    Item,
    ItemCreate,
    ItemPublic,
    ItemsPublic,
    ItemUpdate,
    Message,
    PyObjectId,
)


router = APIRouter(prefix="/items", tags=["items"])


ITEM_NOT_FOUND = "Item not found"
NOT_ENOUGH_PERMISSIONS = "Not enough permissions"


@router.get("/", response_model=ItemsPublic)
async def read_items(
    db: DbDep, current_user: CurrentUser, skip: int = 0, limit: int = 100, q: str = None
) -> Any:
    """
    Retrieve items with optional search filtering.

    - **q**: Optional search query for filtering items by title or description
    """
    # Base filter depending on user permissions
    if current_user.is_superuser:
        base_filter = {}
    else:
        base_filter = {"owner_id": current_user.id}

    # Add search query if provided
    if q:
        # Create a text search filter for title and description fields
        search_filter = {
            "$or": [
                {
                    "title": {"$regex": q, "$options": "i"}
                },  # Case-insensitive search in title
                {
                    "description": {"$regex": q, "$options": "i"}
                },  # Case-insensitive search in description
            ]
        }

        # Combine base filter with search filter
        filter_query = {"$and": [base_filter, search_filter]}
    else:
        filter_query = base_filter

    # Get count of matching documents
    count = await db.items.count_documents(filter_query)

    # Find matching items with pagination
    items_cursor = db.items.find(filter_query).skip(skip).limit(limit)

    # Transform to Pydantic models
    items = [ItemPublic(**item) async for item in items_cursor]

    return ItemsPublic(data=items, count=count)


@router.get("/{id}", response_model=ItemPublic)
async def read_item(db: DbDep, current_user: CurrentUser, id: PyObjectId) -> Any:
    """
    Get item by ID.
    """
    item = await db.items.find_one({"_id": id})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=ITEM_NOT_FOUND
        )
    item_obj = Item(**item)
    if not current_user.is_superuser and (item_obj.owner_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=NOT_ENOUGH_PERMISSIONS
        )
    return item_obj


@router.post("/", response_model=ItemPublic)
async def create_item(
    *, db: DbDep, current_user: CurrentUser, item_in: ItemCreate
) -> Any:
    """
    Create new item.
    """
    item_data = item_in.model_dump()
    item_data["owner_id"] = current_user.id
    result = await db.items.insert_one(item_data)
    created_item = await db.items.find_one({"_id": result.inserted_id})
    return Item(**created_item)


@router.put("/{id}", response_model=ItemPublic)
async def update_item(
    *,
    db: DbDep,
    current_user: CurrentUser,
    id: PyObjectId,
    item_in: ItemUpdate,
) -> Any:
    """
    Update an item.
    """
    item = await db.items.find_one({"_id": id})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=ITEM_NOT_FOUND
        )
    item_obj = Item(**item)
    if not current_user.is_superuser and (item_obj.owner_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=NOT_ENOUGH_PERMISSIONS
        )

    update_data = item_in.model_dump(exclude_unset=True)
    await db.items.update_one({"_id": id}, {"$set": update_data})
    updated_item = await db.items.find_one({"_id": id})
    return Item(**updated_item)


@router.delete("/{id}")
async def delete_item(db: DbDep, current_user: CurrentUser, id: PyObjectId) -> Message:
    """
    Delete an item.
    """
    item = await db.items.find_one({"_id": id})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    item_obj = Item(**item)
    if not current_user.is_superuser and (item_obj.owner_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough permissions"
        )

    await db.items.delete_one({"_id": id})
    return Message(message="Item deleted successfully")
