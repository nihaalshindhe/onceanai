from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_routes
from generate import router as project_routes
from export import router as export_routes
import os
from dotenv import load_dotenv
load_dotenv()
WEB_URL = os.getenv("WEB_URL")

app = FastAPI()

origins = [WEB_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes, prefix="/auth")
app.include_router(project_routes, prefix="/project")
app.include_router(export_routes, prefix="/export")
