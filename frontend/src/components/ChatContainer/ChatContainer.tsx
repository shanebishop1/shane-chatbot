import React from 'react';
import styles from './ChatContainer.module.css';
import MessagesContainer from '../MessagesContainer/MessagesContainer';
import InputContainer from '../InputContainer/InputContainer';
import { MessageProvider } from '../../context/messageContext';

const ChatContainer = () => {
  return (
    <MessageProvider>
      <div className={styles.chatContainer}>
        <MessagesContainer />
        <InputContainer />
      </div>
    </MessageProvider>
  );
};

export default ChatContainer;
