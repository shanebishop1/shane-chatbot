from datetime import datetime
from src.database.models import DBMessage
from src.types.types import Message


def convert_message_to_db_message(message: Message, user_email: str) -> DBMessage:
    return DBMessage(
        sender=message.sender,
        text=message.text,
        user_email=user_email,
        context=message.context,
        timestamp=message.timestamp,
    )
