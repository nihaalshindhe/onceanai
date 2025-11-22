from pydantic import BaseModel
from typing import List, Optional

class Register(BaseModel):
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class ProjectCreate(BaseModel):
    topic: str
    doc_type: str
    outline: List[str]

class Refine(BaseModel):
    section_id: int
    prompt: str
    feedback: Optional[str] = None
    comment: Optional[st]()
