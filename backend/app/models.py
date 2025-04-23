from typing import Optional, List
from datetime import datetime, timezone
from pydantic import EmailStr, Field, BaseModel, ConfigDict, Field, field_serializer
from pydantic_core import core_schema
from bson import ObjectId
from typing import Any
from pymongo_orm import AsyncMongoModel
from pymongo import ASCENDING, DESCENDING


class PyObjectId:
    @classmethod
    def __get_pydantic_core_schema__(  # type: ignore[misc]
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema(
                [
                    core_schema.is_instance_schema(ObjectId),
                    core_schema.chain_schema(
                        [
                            core_schema.str_schema(),
                            core_schema.no_info_plain_validator_function(cls.validate),
                        ]
                    ),
                ]
            ),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value: Any) -> ObjectId:  # type: ignore[misc]
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


class UserBase(AsyncMongoModel):
    __collection__ = "users"
    __indexes__ = [
        {"fields": [("email", ASCENDING)], "unique": True, "background": True},
        {
            "fields": [("full_name", ASCENDING), ("created_at", DESCENDING)],
            "background": True,
        },
    ]

    __write_concern__ = {"w": "majority", "j": True}

    email: EmailStr = Field(..., json_schema_extra={"unique": True}, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = Field(default=None, max_length=255)
    last_login: Optional[datetime] = None

    def before_save(self):
        """Hook that runs before saving."""
        self.full_name = self.full_name.strip()
        self.email = self.email.lower()

    _pre_save_hooks = [before_save]

    async def update_last_login(self, *, db):
        """Update the last login timestamp."""
        self.last_login = datetime.now(timezone.utc)
        await self.save(db)

    @classmethod
    async def find_by_email(cls, *, db, email: str):
        """Find a user by email (case-insensitive)."""
        return await cls.find_one(db, {"email": email.lower()})


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=40)


class UserRegister(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    full_name: Optional[str] = Field(default=None, max_length=255)


class UserUpdateMe(BaseModel):
    full_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)


class UpdatePassword(BaseModel):
    current_password: str = Field(..., min_length=8, max_length=40)
    new_password: str = Field(..., min_length=8, max_length=40)


class User(UserBase):

    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


class UserPublic(UserBase):

    model_config = ConfigDict(
        populate_by_name=True,
    )


class UsersPublic(BaseModel):
    data: List[UserPublic]
    count: int


class ItemBase(AsyncMongoModel):
    __collection__ = "items"
    __indexes__ = [
        {
            "fields": [("title", ASCENDING), ("created_at", DESCENDING)],
            "background": True,
        },
    ]

    __write_concern__ = {"w": "majority", "j": True}

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)


class Item(ItemBase):
    owner_id: PyObjectId = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ItemPublic(ItemBase):

    owner_id: PyObjectId

    model_config = ConfigDict(
        populate_by_name=True,
    )


class ItemsPublic(BaseModel):
    data: List[ItemPublic]
    count: int


class Message(BaseModel):
    message: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id: str
    full_name: str | None = ""
    email: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class NewPassword(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=40)
