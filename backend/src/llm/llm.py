from typing import Dict, List
from openai import OpenAI
from openai.types.chat import ChatCompletion

from src.types.types import Message


def get_llm_response(context: str, context_history: List[Message]) -> str:
    llm_context: List[Dict[str, str]] = [
        {
            "role": "system",
            "content": f"You are an AI chatbot named Ava, made by a company called Artisan. You help with sales and marketing. The overall context of this conversation will be: {context}",
        },
    ]
    llm_context += convert_thread_to_llm_history(context_history)
    client: OpenAI = OpenAI()
    completion: ChatCompletion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=llm_context,  # type: ignore
    )
    llm_response: str | None = completion.choices[0].message.content
    if llm_response is None:
        raise ValueError("LLM response is empty")
    return llm_response


def convert_thread_to_llm_history(
    context_history: List[Message],
) -> List[Dict[str, str]]:
    return [convert_message_to_llm_interaction(message) for message in context_history]


def convert_message_to_llm_interaction(message: Message) -> Dict[str, str]:
    return {
        "role": "user" if message.sender == "user" else "assistant",
        "content": message.text,
    }
