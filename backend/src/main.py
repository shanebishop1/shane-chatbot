import os
from pprint import pprint
import time
from datetime import datetime
import random
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from src.database.database import get_db
from src.database.models import DBMessage
from src.llm.llm import get_llm_response
from src.types.types import Message
from src.utils.utils import convert_message_to_db_message

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


@app.get("/chat/{context}")
async def get_chat_thread(context: str, db: Session = Depends(get_db)):
    messages = (
        db.query(DBMessage)
        .filter(DBMessage.context == context)
        .order_by(DBMessage.timestamp)
        .all()
    )

    if not messages:
        return []
    return messages


@app.post("/chat", response_model=Message)
async def send_message(newMessage: Message, db: Session = Depends(get_db)):
    db.add(convert_message_to_db_message(newMessage))
    db.commit()

    llm_response = get_llm_response(
        f"Context is {newMessage.context}:\n {newMessage.text}"
    )

    # Get time in milliseconds to match how it's handled in the frontend
    timestamp = int(time.time() * 1000)
    llm_response_text = llm_response.content

    if not llm_response_text:
        raise ValueError("llm_response_text must not be null")

    llm_response_message = Message(
        id=round(timestamp / 1000) - round(random.random() * 10),
        sender="chatgpt",
        text=llm_response_text,
        context=newMessage.context,
        timestamp=timestamp,
    )

    db.add(convert_message_to_db_message(llm_response_message))
    db.commit()
    return llm_response_message
