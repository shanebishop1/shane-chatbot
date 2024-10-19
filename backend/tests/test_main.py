import os
from freezegun import freeze_time
from datetime import datetime
from unittest.mock import MagicMock, patch
import pytest
import httpx
from sqlalchemy import Column
from src.database.database import get_db
from src.auth.auth import create_access_token, verify_jwt
from src.database.models import DBMessage
from src.main import app  # Assuming your FastAPI app is in src/main.py
from src.types.types import Message
from dotenv import load_dotenv

app.dependency_overrides[verify_jwt] = lambda: mock_user_email
app.dependency_overrides[get_db] = lambda: MagicMock()


def format_messages(messages):
    for message in messages:
        if isinstance(message["timestamp"], datetime):
            message["timestamp"] = message["timestamp"].isoformat()
    return messages


load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")


# Mock data
mock_token = create_access_token(1, "test@example1.com")
mock_context = "test_context"
mock_user_email = "test@example.com"
mock_messages = [
    Message(
        id=1,
        sender="user",
        text="Hello",
        context="test-context",
        timestamp=datetime.now(),
    ),
    Message(
        id=2,
        sender="chatgpt",
        text="Hi",
        context="test-context",
        timestamp=datetime.now(),
    ),
]


@pytest.mark.asyncio
@patch(
    "src.main.query_chat_thread_by_context",
    return_value=[message.dict() for message in mock_messages],
)
async def test_get_chat_thread(mock_query_chat_thread_by_context):
    async with httpx.AsyncClient(app=app, base_url=f"{FRONTEND_URL}") as async_client:
        response = await async_client.get(f"/api/chat/{mock_context}")

    assert response.status_code == 200
    assert response.json() == format_messages(
        [message.dict() for message in mock_messages]
    )


@pytest.mark.asyncio
async def test_clear_chat_thread():
    async with httpx.AsyncClient(app=app, base_url=f"{FRONTEND_URL}") as async_client:
        response = await async_client.delete(f"/api/chat/{mock_context}")
    assert response.status_code == 200
    assert response.json() == {"message": f"{mock_context} chat cleared"}


@pytest.mark.asyncio
@patch(
    "src.main.get_llm_response",
    return_value="llm response",
)
@patch("src.main.convert_message_to_db_message")
@patch("src.main.datetime")
async def test_send_message(
    mock_datetime, mock_convert_msg_to_db_msg, mock_get_llm_response
):
    mock_datetime.now.return_value = datetime.now()
    new_message = {
        "id": 0,
        "sender": "user",
        "text": "Hello",
        "context": "test-context",
        "timestamp": f"{datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')}",
    }
    mock_converted_db_message = MagicMock(spec=DBMessage)
    mock_converted_db_message.id = 1
    mock_convert_msg_to_db_msg.return_value = mock_converted_db_message

    async with httpx.AsyncClient(app=app, base_url=f"{FRONTEND_URL}") as async_client:
        response = await async_client.post("/api/chat", json=new_message)
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["sender"] == "chatgpt"
    assert response_json["id"] == mock_converted_db_message.id
    assert response_json["text"] == mock_get_llm_response.return_value
    assert response_json["context"] == new_message["context"]


@pytest.mark.asyncio
@patch("src.main.id_token.verify_oauth2_token")
@patch("src.main.create_refresh_token")
@patch("src.main.create_access_token")
async def test_login(
    mock_create_access_token, mock_create_refresh_token, mock_verify_oauth2_token
):
    mock_verify_oauth2_token.return_value = {
        "iss": "accounts.google.com",
        "aud": os.getenv("GOOGLE_CLIENT_ID"),
        "sub": "1234567890",
        "email": mock_user_email,
    }
    mock_create_refresh_token.return_value = "mock_refresh_token"
    mock_create_access_token.return_value = "mock_access_token"

    request_data = {"token": "mock_token"}

    async with httpx.AsyncClient(app=app, base_url=f"{FRONTEND_URL}") as async_client:
        response = await async_client.post("/api/auth/login", json=request_data)

    assert response.status_code == 200
    response_json = response.json()
    assert response_json["access_token"] == "mock_access_token"
    assert response_json["email"] == mock_user_email
    assert "exp" in response_json


@pytest.mark.asyncio
@patch("src.main.decode_jwt")
@patch("src.main.create_refresh_token")
@patch("src.main.create_access_token")
async def test_refresh_token(
    mock_create_access_token, mock_create_refresh_token, mock_decode_jwt
):
    mock_decode_jwt.return_value = {"sub": 1, "email": mock_user_email}
    mock_create_refresh_token.return_value = "new_mock_refresh_token"
    mock_create_access_token.return_value = "new_mock_access_token"

    cookies = {"refresh_token": "mock_refresh_token"}

    async with httpx.AsyncClient(app=app, base_url=f"{FRONTEND_URL}") as async_client:
        response = await async_client.post("/api/auth/refresh", cookies=cookies)

    assert response.status_code == 200
    response_json = response.json()
    assert response_json["access_token"] == "new_mock_access_token"
    assert response_json["email"] == mock_user_email
    assert "exp" in response_json
