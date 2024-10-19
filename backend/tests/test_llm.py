from unittest.mock import MagicMock, patch
from datetime import datetime
from src.types.types import Message
from src.llm.llm import (
    get_llm_response,
    convert_thread_to_llm_history,
    convert_message_to_llm_interaction,
)

context = "Sales and marketing strategies"
context_history = [
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


@patch("src.llm.llm.OpenAI")
def test_get_llm_response(mock_openai):
    mock_response = MagicMock()
    mock_response.choices[0].message.content = (
        "You should focus on personalized marketing."
    )

    mock_client = mock_openai.return_value
    mock_client.chat.completions.create.return_value = mock_response

    response = get_llm_response(context, context_history)

    assert response == "You should focus on personalized marketing."
    mock_client.chat.completions.create.assert_called_once()
    assert mock_client.chat.completions.create.call_args[1]["model"] == "gpt-4o-mini"
    assert (
        "Sales and marketing strategies"
        in mock_client.chat.completions.create.call_args[1]["messages"][0]["content"]
    )


def test_convert_message_to_llm_interaction():
    message = Message(
        id=3,
        sender="user",
        text="How can I improve my sales?",
        context="test-context",
        timestamp=datetime.now(),
    )
    expected_output = {
        "role": "user",
        "content": "How can I improve my sales?",
    }
    assert convert_message_to_llm_interaction(message) == expected_output

    message = Message(
        id=3,
        sender="assistant",
        text="You can start by understanding your target audience.",
        context="test-context",
        timestamp=datetime.now(),
    )
    expected_output = {
        "role": "assistant",
        "content": "You can start by understanding your target audience.",
    }
    assert convert_message_to_llm_interaction(message) == expected_output


def test_convert_thread_to_llm_history():
    expected_output = [
        {"role": context_history[0].sender, "content": context_history[0].text},
        {"role": "assistant", "content": context_history[1].text},
    ]
    assert convert_thread_to_llm_history(context_history) == expected_output
