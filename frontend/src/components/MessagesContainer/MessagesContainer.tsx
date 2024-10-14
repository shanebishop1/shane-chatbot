import React, { useContext, useEffect, useRef } from 'react';
import { MessageContext } from '../../context/messageContext';
import { MessageContextType } from '../../types/types';
import LLMMessage from '../LLMMessage/LLMMessage';
import UserMessage from '../UserMessage/UserMessage';
import styles from './MessagesContainer.module.css';
import { hasVerticalScrollbar } from '../../utils/utils';

const MessagesContainer = () => {
  const messageContext = useContext(MessageContext) as MessageContextType;
  const { messages } = messageContext;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of messages container when new messages are added
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div
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
