from fastapi import APIRouter, Depends, HTTPException
from database.db import get_db
from models.user import UserRegister, UserLogin
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

router  = APIRouter()
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET = os.getenv("JWT_SECRET", "secret")
ALGO   = os.getenv("JWT_ALGORITHM", "HS256")
EXPIRE = int(os.getenv("JWT_EXPIRE_MINUTES", 1440))

# Staff emails — since users table has no role column
# add your staff email here
STAFF_EMAILS = {"staff@orderly.com", "admin@orderly.com"}

def make_token(user: dict) -> str:
    role   = "staff" if user["email"] in STAFF_EMAILS else "customer"
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE)
    payload = {
        "sub":   str(user["id"]),
        "email": user["email"],
        "name":  user["name"],
        "role":  role,
        "exp":   expire
    }
    return jwt.encode(payload, SECRET, algorithm=ALGO)

@router.post("/register")
def register(body: UserRegister, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id FROM users WHERE email = %s", (body.email,)
    )
    if cursor.fetchone():
        cursor.close()
        raise HTTPException(
            status_code=400, detail="Email already registered"
        )

    hashed = pwd_ctx.hash(body.password)
    # Insert into users — no role column in your table
    cursor.execute(
        """INSERT INTO users (name, email, password_hash)
           VALUES (%s, %s, %s)""",
        (body.name, body.email, hashed)
    )
    db.commit()
    user_id = cursor.lastrowid
    cursor.close()
    return {"message": "Registered successfully", "user_id": user_id}

@router.post("/login")
def login(body: UserLogin, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM users WHERE email = %s", (body.email,)
    )
    user = cursor.fetchone()
    cursor.close()

    if not user or not pwd_ctx.verify(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=401, detail="Invalid email or password"
        )

    token = make_token(user)
    role  = "staff" if user["email"] in STAFF_EMAILS else "customer"
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":    user["id"],
            "name":  user["name"],
            "email": user["email"],
            "role":  role
        }
    }