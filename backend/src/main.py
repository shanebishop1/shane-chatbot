import os
from pprint import pprint
import time
import random
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
    # Get time in milliseconds to match how it's handled in the frontend
    timestamp = int(time.time() * 1000)
    llm_response = get_llm_response("Tell me something cool in less than 20 words.")
    llm_response_message = llm_response.content
    return {
        "id": timestamp - random.random(),
        "sender": "chatgpt",
        "text": llm_response_message,
        "timestamp": timestamp,
    }


def get_llm_response(message):
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": message},
        ],
    )
    return completion.choices[0].message
