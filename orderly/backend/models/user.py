from pydantic import BaseModel, EmailStr

# users table: id, name, email, password_hash, created_at
# NOTE: no role column in your table

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str