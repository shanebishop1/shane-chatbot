import { FaRegTrashCan } from 'react-icons/fa6';
import React, { useContext } from 'react';
import styles from './PrefsModal.module.css';
import { MessageContext } from '../../context/messageContext';
import { MessageContextType } from '../../types/types';
import { deleteChatThreadByContext } from '../../api/chat';

interface PrefsModalProps {
    setShowPrefs: React.Dispatch<React.SetStateAction<boolean>>;
    userCurrentContext: string;
}

const PrefsModal: React.FC<PrefsModalProps> = ({
    setShowPrefs,
    userCurrentContext,
}) => {
    const messageContext = useContext(MessageContext) as MessageContextType;
    return (
        <div className={styles.prefsModal}>
            <div className={styles.prefContainer}>
                <button
                    type="button"
                    className={styles.prefButton}
                    onClick={() => {
                        messageContext.clearMessages();
                        deleteChatThreadByContext(userCurrentContext);
                        setShowPrefs(false);
                    }}
                >
                    <FaRegTrashCan className={styles.prefIcon} />
                    Clear Chat
                </button>
            </div>
        </div>
    );
};

export default PrefsModal;
