import messageStyles from '../../styles/shared.module.css';
import styles from './UserMessage.module.css';

interface UserMessageProps {
    message: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
    return (
        <div className={`${messageStyles.chatMessage} ${styles.userMessage}`}>
            {message}
        </div>
    );
};

export default UserMessage;
