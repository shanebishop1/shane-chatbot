import messageStyles from '../../styles/shared.module.css';
import styles from './UserMessage.module.css';

const UserMessage = () => {
    return (
        <div className={`${messageStyles.chatMessage} ${styles.userMessage}`}>
            Hi, thanks for connecting! Hi, thanks for connecting!
        </div>
    );
};

export default UserMessage;
