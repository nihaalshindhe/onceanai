from pydantic import BaseModel
from typing import List, Optional

class Register(BaseModel):
    username: str
    password: str

class Login(BaseModel):
    username: str
    password: str

class SectionCreate(BaseModel):
    title: str
    prompt: str

class ProjectCreate(BaseModel):
    topic: str
    doc_type: str
    sections: List[SectionCreate]

class Refine(BaseModel):
    section_id: int
    prompt: str
    feedback: Optional[str] = None
    comment: Optional[str] = None
