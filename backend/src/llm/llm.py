from openai import OpenAI
from src.database.database import query_chat_thread_by_context


def get_llm_response(message, context, database):
    llm_context = [
        {
            "role": "system",
            "content": f"The overall context of this converstaion is: {context}",
        },
    ]
    thread = query_chat_thread_by_context(context, database)
    llm_context += convert_thread_to_llm_history(context, thread)
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=llm_context,  # type: ignore
    )
    return completion.choices[0].message


def convert_thread_to_llm_history(context, thread):
    return [convert_message_to_llm_interaction(message) for message in thread]


def convert_message_to_llm_interaction(message):
    return {
        "role": "user" if message.sender == "user" else "assistant",
        "content": message.text,
    }
