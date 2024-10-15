import os
from datetime import datetime
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from src.database.database import get_db, query_chat_thread_by_context
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
        allow_methods=["GET", "POST", "DELETE"],
        allow_headers=["*"],
    )


@app.get("/chat/{context}", response_model=List[Message])
async def get_chat_thread(context: str, db: Session = Depends(get_db)):
    messages = query_chat_thread_by_context(context, db)
    if not messages:
        return []
    return messages


@app.delete("/chat/{context}", response_model=dict[str, str])
async def clear_chat_thread(context: str, db: Session = Depends(get_db)):
    db.query(DBMessage).filter(DBMessage.context == context).delete()
    db.commit()
    return {"message": f"{context} chat cleared"}


@app.post("/chat", response_model=Message)
async def send_message(newMessage: Message, db: Session = Depends(get_db)):
    db.add(convert_message_to_db_message(newMessage))
    db.commit()

    llm_response = get_llm_response(
        f"Context is {newMessage.context}:\n {newMessage.text}"
    )

    llm_response_text = llm_response.content

    if not llm_response_text:
        raise ValueError("llm_response_text must not be null")

    llm_response_message = Message(
        id=0,
        sender="chatgpt",
        text=llm_response_text,
        context=newMessage.context,
        timestamp=datetime.now(),
    )

    llm_db_message = convert_message_to_db_message(llm_response_message)
    db.add(llm_db_message)
    db.flush()
    new_id = llm_db_message.id
    db.commit()
    llm_response_message.id = int(new_id)  # type: ignore
    return llm_response_message
