from datetime import datetime
from src.database.models import DBMessage
from src.types.types import Message


def convert_message_to_db_message(message: Message) -> DBMessage:
    return DBMessage(
        sender=message.sender,
        text=message.text,
        context=message.context,
        timestamp=message.timestamp,
    )
