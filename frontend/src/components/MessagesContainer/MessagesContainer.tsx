import LLMMessage from '../LLMMessage/LLMMessage';
import UserMessage from '../UserMessage/UserMessage';
import styles from './MessagesContainer.module.css';

const MessagesContainer = () => {
  return (
    <div className={styles.messagesContainer}>
      <UserMessage /> <LLMMessage />
      <UserMessage /> <LLMMessage />
      <UserMessage /> <LLMMessage />
    </div>
  );
};

export default MessagesContainer;
