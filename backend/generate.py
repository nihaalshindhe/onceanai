from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import Project, Section, Revision
from schemas import ProjectCreate, Refine
from llm import generate_text
import jwt

router = APIRouter()
SECRET = # will add env for this

def get_user_id(token: str):
    try:
        data = jwt.decode(token, SECRET, algorithms=["HS256"])
        return data["id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/create")
def create_project(data: ProjectCreate, token: str):
    db = SessionLocal()
    user_id = get_user_id(token)

    project = Project(
        user_id=user_id,
        topic=data.topic,
        doc_type=data.doc_type,
        outline="|".join(data.outline)
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    # Generate AI content for each section
    for title in data.outline:
        prompt = f"Write detailed content for '{title}' under the topic '{data.topic}'."
        content = generate_text(prompt)

        section = Section(
            project_id=project.id,
            title=title,
            content=content
        )
        db.add(section)

    db.commit()
    return {"project_id": project.id}

@router.post("/refine")
def refine_section(data: Refine):
    db = SessionLocal()

    section = db.query(Section).filter(Section.id == data.section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    refine_prompt = (
        f"Refine the following section based on the instructions.\n\n"
        f"Original:\n{section.content}\n\n"
        f"Instruction:\n{data.prompt}"
    )

    new_text = generate_text(refine_prompt)
    section.content = new_text

    revision = Revision(
        section_id=data.section_id,
        prompt=data.prompt,
        result=new_text,
        feedback=data.feedback,
        comment=data.comment
    )

    db.add(revision)
    db.commit()

    return {"updated_content": new_text}

@router.get("/sections/{project_id}")
def get_sections(project_id: int):
    db = SessionLocal()
    sections = db.query(Section).filter(Section.project_id == project_id).all()
    return sections
