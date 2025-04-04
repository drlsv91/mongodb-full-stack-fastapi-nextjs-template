from typing import Optional, List
from datetime import datetime
from pydantic import EmailStr, Field, BaseModel, ConfigDict, Field, field_serializer
from pydantic_core import core_schema
from bson import ObjectId
from typing import Any


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


class UserBase(BaseModel):
    email: EmailStr = Field(..., json_schema_extra={"unique": True}, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = Field(default=None, max_length=255)


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
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

    @field_serializer("id", when_used="json")
    def serialize_id(self, id: PyObjectId, _info):
        return str(id)

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime(self, dt: datetime, _info):
        return dt.isoformat()


class UserPublic(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    model_config = ConfigDict(
        populate_by_name=True,
    )

    @field_serializer("id", when_used="json")
    def serialize_id(self, id: PyObjectId, _info):
        return str(id)


class UsersPublic(BaseModel):
    data: List[UserPublic]
    count: int


class ItemBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)


class Item(ItemBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    owner_id: PyObjectId = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

    @field_serializer("id", "owner_id", when_used="json")
    def serialize_objectid(self, obj_id: PyObjectId, _info):
        return str(obj_id)

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime(self, dt: datetime, _info):
        return dt.isoformat()


class ItemPublic(ItemBase):
    id: PyObjectId = Field(..., alias="_id")
    owner_id: PyObjectId

    model_config = ConfigDict(
        populate_by_name=True,
    )

    @field_serializer("id", "owner_id", when_used="json")
    def serialize_objectid(self, obj_id: PyObjectId, _info):
        return str(obj_id)


class ItemsPublic(BaseModel):
    data: List[ItemPublic]
    count: int


class Message(BaseModel):
    message: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class NewPassword(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=40)
