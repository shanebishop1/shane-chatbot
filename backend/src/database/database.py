from typing import Generator, List
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.orm import Session, sessionmaker
from dotenv import load_dotenv

import os

from src.database.models import DBMessage
from src.types.types import Message

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine: sqlalchemy.engine.Engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def query_chat_thread_by_context(
    context: str, user_email: str, db: Session
) -> List[Message]:
    db_messages: List[DBMessage] = (
        db.query(DBMessage)
        .filter(DBMessage.context == context)
        .filter(DBMessage.user_email == user_email)
        .order_by(DBMessage.timestamp)
        .all()
    )
    messages: List[Message] = [
        Message(
            id=db_message.__dict__["id"],
            sender=db_message.__dict__["sender"],
            text=db_message.__dict__["text"],
            context=db_message.__dict__["context"],
            timestamp=db_message.__dict__["timestamp"],
        )
        for db_message in db_messages
    ]
    return messages
