import messageStyles from '../../styles/shared.module.css';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import llmProfile from '../../assets/llmProfile.png';
import styles from './LLMMessage.module.css';

interface LLMMessageProps {
  message: string;
}
const LLMMessage: React.FC<LLMMessageProps> = ({ message }) => {
  return (
    <div className={styles.llmMessageContainer}>
      <ProfilePicture
        src={llmProfile}
        imageType="AI"
        className={styles.llmProfilePicture}
      />
      <div className={`${messageStyles.chatMessage} ${styles.llmMessage}`}>
        {message}
      </div>
    </div>
  );
};

export default LLMMessage;
