import os
from pprint import pprint
import time
import random
from fastapi import FastAPI
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .llm.llm import get_llm_response
from .types.types import Message

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


@app.get("/chat/{context_id}", response_model=List[Message])
def get_chat_thread():
    return messages


@app.post("/chat", response_model=Message)
def send_message(newMessage: Message):
    llm_response = get_llm_response(
        f"Context is {newMessage.context}:\n {newMessage.text}"
    )

    # Get time in milliseconds to match how it's handled in the frontend
    timestamp = int(time.time() * 1000)
    llm_response_message = llm_response.content
    return {
        "id": timestamp - round(random.random() * 10),
        "sender": "chatgpt",
        "text": llm_response_message,
        "context": newMessage.context,
        "timestamp": timestamp,
    }
