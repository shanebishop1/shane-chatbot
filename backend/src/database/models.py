from typing import Type
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import Sequence

Base: Type = declarative_base()


class DBMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, Sequence("messages_id_seq"), primary_key=True)
    sender = Column(String)
    user_email = Column(String)
    text = Column(Text)
    context = Column(String)
    timestamp = Column(DateTime)
