from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class DBMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    sender = Column(String)
    text = Column(Text)
    context = Column(String)
    timestamp = Column(DateTime)
