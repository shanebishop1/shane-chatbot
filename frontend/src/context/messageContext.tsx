import React, { createContext, useState, ReactNode } from 'react';
import { Message, MessageContextType } from '../types/types';

export const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const clearMessages = () => {
    setMessages([]);
  };

  const pushMessage = (newMessage: Message) => {
    console.log(`Pushing message ${JSON.stringify(newMessage)}`);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <MessageContext.Provider value={{ messages, pushMessage, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
