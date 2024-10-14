import messageStyles from '../../styles/shared.module.css';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import aiProfile from '../../assets/aiProfile.png';
import styles from './LLMMessage.module.css';

const LLMMessage = () => {
    return (
        <div className={`${messageStyles.chatMessage} ${styles.llmMessage}`}>
            Test message generated by the LLM.
        </div>
    );
interface LLMMessageProps {
  message: string;
}
const LLMMessage: React.FC<LLMMessageProps> = ({ message }) => {
  return (
    <div className={styles.llmMessageContainer}>
      <ProfilePicture
        src={aiProfile}
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
