from fastapi import APIRouter, HTTPException
from schemas import Register, Login
from database import SessionLocal
from models import User
import jwt

router = APIRouter()
SECRET = # will add env for this

@router.post("/register")
def register(data: Register):
    db = SessionLocal()

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(email=data.email, password=data.password)
    db.add(user)
    db.commit()
    return {"message": "User registered"}

@router.post("/login")
def login(data: Login):
    db = SessionLocal()

    user = db.query(User).filter(
        User.email == data.email,
        User.password == data.password
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt.encode({"id": user.id}, SECRET, algorithm="HS256")
    return {"token": token}
