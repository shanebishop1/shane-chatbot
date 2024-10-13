import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
frontend_url = os.getenv("FRONTEND_URL")

app = FastAPI()

if frontend_url:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_url],
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )


@app.get("/")
def read_root():
    return {"message": "environment setup"}
