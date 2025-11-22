from fastapi import FastAPI
from auth import router as auth_routes
from generate import router as project_routes
from export import router as export_routes

app = FastAPI()

app.include_router(auth_routes, prefix="/auth")
app.include_router(project_routes, prefix="/project")
app.include_router(export_routes, prefix="/export")
