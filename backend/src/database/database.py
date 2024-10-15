from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from dotenv import load_dotenv

import os

from src.database.models import DBMessage

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def query_chat_thread_by_context(context: str, db: Session):
    messages = (
        db.query(DBMessage)
        .filter(DBMessage.context == context)
        .order_by(DBMessage.timestamp)
        .all()
    )
    return messages
