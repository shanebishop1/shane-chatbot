from pydantic import BaseModel
from datetime import datetime


# Model for the message payload when sending a message
class Message(BaseModel):
    id: int
    sender: str
    text: str
    context: str
    timestamp: datetime


class UserInfo(BaseModel):
    access_token: str
    email: str
    exp: int
