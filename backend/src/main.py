import os
from datetime import datetime, timedelta
from typing import Dict, List, Union
from dotenv import load_dotenv
import jwt
from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
from src.database.database import get_db, query_chat_thread_by_context
from src.database.models import DBMessage
from src.llm.llm import get_llm_response
from src.types.types import Message, UserInfo
from src.utils.utils import convert_message_to_db_message
from src.auth.auth import (
    create_access_token,
    create_refresh_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    verify_jwt,
    decode_jwt,
)

load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

app = FastAPI()

if FRONTEND_URL:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[FRONTEND_URL],  # Only allow this origin
        allow_credentials=True,  # Allow cookies to be sent
        allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
        allow_headers=["*"],  # Allow all headers (including custom headers)
    )
else:
    raise ValueError("FRONTEND_URL must be set as an environment variable.")


@app.get("/api/chat/{context}", response_model=List[Message])
async def get_chat_thread(
    context: str,
    db: Session = Depends(get_db),
    user_email: str = Depends(verify_jwt),
) -> List[Message]:
    messages: List[Message] = query_chat_thread_by_context(context, user_email, db)
    if not messages:
        return []
    return messages


@app.delete("/api/chat/{context}", response_model=dict[str, str])
async def clear_chat_thread(
    context: str,
    db: Session = Depends(get_db),
    user_email: str = Depends(verify_jwt),
) -> dict[str, str]:
    db.query(DBMessage).filter(DBMessage.context == context).filter(
        DBMessage.user_email == user_email
    ).delete()
    db.commit()
    return {"message": f"{context} chat cleared"}


@app.post("/api/chat", response_model=Message)
async def send_message(
    newMessage: Message,
    db: Session = Depends(get_db),
    user_email: str = Depends(verify_jwt),
) -> Message:
    db.add(convert_message_to_db_message(newMessage, user_email))
    db.commit()

    context: str = newMessage.context
    context_history: list[Message] = query_chat_thread_by_context(
        context, user_email, db
    )

    llm_response: str = get_llm_response(context, context_history)

    llm_response_message = Message(
        id=0,
        sender="chatgpt",
        text=llm_response,
        context=newMessage.context,
        timestamp=datetime.now(),
    )

    llm_db_message: DBMessage = convert_message_to_db_message(
        llm_response_message, user_email
    )
    db.add(llm_db_message)
    db.commit()
    llm_response_message.id = int(llm_db_message.id)  # type: ignore
    return llm_response_message


@app.post("/api/auth/login")
async def login(request: Request, response: Response) -> UserInfo:
    try:
        data: Dict[str, str] = await request.json()
        token = data["token"]
        idinfo: Dict[str, Union[str, int]] = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )
        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer.")
        if idinfo["aud"] != GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=400, detail="Invalid Client ID")

        user_id: int = int(idinfo["sub"])
        user_email: str = str(idinfo["email"])
        refresh_token: str = create_refresh_token(user_id, user_email)

        # Set the refresh token as an HTTP-only, Secure cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        )

        # Generate an access token for immediate use
        access_token: str = create_access_token(user_id, user_email)
        expiration_date: datetime = datetime.now() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
        expiration = int(expiration_date.timestamp())

        return UserInfo(access_token=access_token, email=user_email, exp=expiration)

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.post("/api/auth/refresh")
async def refresh_token(request: Request, response: Response) -> UserInfo:
    refresh_token: str | None = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is missing")

    try:
        # Decode the refresh token
        payload: dict = decode_jwt(refresh_token)
        user_id: int | None = payload.get("sub")
        user_email: int | None = payload.get("email")
        if not payload or not user_id or not user_email:
            raise jwt.InvalidTokenError("Invalid refresh token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token: str = create_access_token(user_id, user_email)
    new_refresh_token: str = create_refresh_token(user_id, user_email)

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )

    expiration_date: datetime = datetime.now() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    expiration: int = int(expiration_date.timestamp())
    return UserInfo(access_token=new_access_token, email=user_email, exp=expiration)
