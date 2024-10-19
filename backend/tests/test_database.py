from src.database.models import DBMessage
from src.database.database import query_chat_thread_by_context, get_db
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session
from datetime import datetime

mock_user_email = "test@example.com"
mock_context = "test_context"


def test_query_chat_thread_by_context():
    mock_db = MagicMock(spec=Session)
    mock_db.query.return_value.filter.return_value.filter.return_value.order_by.return_value.all.return_value = [
        DBMessage(
            id=1,
            sender="user",
            text="Hello",
            context="test-context",
            timestamp=datetime.now(),
            user_email=mock_user_email,
        ),
        DBMessage(
            id=2,
            sender="chatgpt",
            text="Hi",
            context="test-context",
            timestamp=datetime.now(),
            user_email=mock_user_email,
        ),
    ]

    messages = query_chat_thread_by_context(mock_context, mock_user_email, mock_db)
    assert len(messages) == 2
    assert messages[0].sender == "user"
    assert messages[1].sender == "chatgpt"
    assert messages[0].context == "test-context"
    assert messages[1].context == "test-context"
