from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import Register, Login
from database import SessionLocal, get_db
from models import User
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
SECRET = os.getenv("JWT_SECRET")

@router.post("/register")
def register(data: Register, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(username=data.username, password=data.password)
    db.add(user)
    db.commit()
    return {"message": "User registered"}

@router.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == data.username,
        User.password == data.password
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt.encode({"id": user.id}, SECRET, algorithm="HS256")
    return {"token": token}
