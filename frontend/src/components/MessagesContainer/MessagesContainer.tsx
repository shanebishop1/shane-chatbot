import React, { useEffect, useRef } from 'react';
import { useMessages } from '../../context/messageContext';
import { MessageContextType } from '../../types/types';
import LLMMessage from '../LLMMessage/LLMMessage';
import UserMessage from '../UserMessage/UserMessage';
import styles from './MessagesContainer.module.css';
import { hasVerticalScrollbar } from '../../utils/utils';

const MessagesContainer: React.FC = () => {
  const { messages } = useMessages() as MessageContextType;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of messages container when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div
      data-testid="messagesContainer"
      className={`${styles.messagesContainer} ${!hasVerticalScrollbar(styles.messagesContainer) ? styles.scrollBarFix : ''}`}
    >
      {messages.map((message, index) =>
        message.sender === 'user' ? (
          <UserMessage key={index} message={message.text} />
        ) : (
          <LLMMessage key={index} message={message.text} />
        ),
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;
