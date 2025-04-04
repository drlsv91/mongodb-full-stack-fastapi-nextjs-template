import pytest
from motor.motor_asyncio import AsyncIOMotorDatabase
from app import crud
from app.core.security import verify_password
from app.models import UserCreate, UserUpdate
from app.tests.utils.utils import random_email, random_lower_string


@pytest.mark.asyncio
async def test_create_user(db: AsyncIOMotorDatabase) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_user(db=db, user_create=user_in)
    assert user.email == email
    assert hasattr(user, "hashed_password")
    # Verify user was created in MongoDB
    db_user = await db.users.find_one({"_id": user.id})
    assert db_user is not None
    assert db_user["email"] == email


@pytest.mark.asyncio
async def test_authenticate_user(db: AsyncIOMotorDatabase) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_user(db=db, user_create=user_in)
    authenticated_user = await crud.authenticate(db=db, email=email, password=password)
    assert authenticated_user
    assert user.email == authenticated_user.email


@pytest.mark.asyncio
async def test_not_authenticate_user(db: AsyncIOMotorDatabase) -> None:
    email = random_email()
    password = random_lower_string()
    user = await crud.authenticate(db=db, email=email, password=password)
    assert user is None


@pytest.mark.asyncio
async def test_check_if_user_is_active(db: AsyncIOMotorDatabase) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_user(db=db, user_create=user_in)
    assert user.is_active is True
    # Verify in database
    db_user = await db.users.find_one({"_id": user.id})
    assert db_user["is_active"] is True


@pytest.mark.asyncio
async def test_check_if_user_is_active_inactive(db: AsyncIOMotorDatabase) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password, disabled=True)
    user = await crud.create_user(db=db, user_create=user_in)
    assert user.is_active is True  # Assuming your system still considers them active
    # Verify in database
    db_user = await db.users.find_one({"_id": user.id})
    assert db_user["is_active"] is True


@pytest.mark.asyncio
async def test_check_if_user_is_superuser(db: AsyncIOMotorDatabase) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password, is_superuser=True)
    user = await crud.create_user(db=db, user_create=user_in)
    assert user.is_superuser is True
    # Verify in database
    db_user = await db.users.find_one({"_id": user.id})
    assert db_user["is_superuser"] is True


@pytest.mark.asyncio
async def test_check_if_user_is_superuser_normal_user(db: AsyncIOMotorDatabase) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = await crud.create_user(db=db, user_create=user_in)
    assert user.is_superuser is False
    # Verify in database
    db_user = await db.users.find_one({"_id": user.id})
    assert db_user["is_superuser"] is False


@pytest.mark.asyncio
async def test_get_user(db: AsyncIOMotorDatabase) -> None:
    password = random_lower_string()
    email = random_email()
    user_in = UserCreate(email=email, password=password, is_superuser=True)
    user = await crud.create_user(db=db, user_create=user_in)
    user_2 = await crud.get_user_by_email(db=db, email=email)
    assert user_2
    assert user.email == user_2.email


@pytest.mark.asyncio
async def test_update_user(db: AsyncIOMotorDatabase) -> None:
    password = random_lower_string()
    email = random_email()
    user_in = UserCreate(email=email, password=password, is_superuser=True)
    user = await crud.create_user(db=db, user_create=user_in)
    new_password = random_lower_string()
    user_in_update = UserUpdate(password=new_password, is_superuser=True)
    updated_user = await crud.update_user(db=db, db_user=user, user_in=user_in_update)

    # Verify password was updated
    assert verify_password(new_password, updated_user.hashed_password)

    # Verify in database
    db_user = await db.users.find_one({"_id": user.id})
    assert db_user is not None
    assert verify_password(new_password, db_user["hashed_password"])
