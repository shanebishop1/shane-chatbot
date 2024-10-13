import React from 'react';
import styles from './ChatContainer.module.css';
import MessagesContainer from '../MessagesContainer/MessagesContainer';
import InputContainer from '../InputContainer/InputContainer';

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <MessagesContainer />
      <InputContainer />
    </div>
  );
};

export default ChatContainer;
