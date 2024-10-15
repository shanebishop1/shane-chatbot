import { FaRegTrashCan } from 'react-icons/fa6';
import React, { useContext, useEffect, useRef } from 'react';
import styles from './PrefsModal.module.css';
import { MessageContext } from '../../context/messageContext';
import { MessageContextType } from '../../types/types';
import { deleteChatThreadByContext } from '../../api/chat';

interface PrefsModalProps {
    setShowPrefs: React.Dispatch<React.SetStateAction<boolean>>;
    userCurrentContext: string;
    openModalRef: React.RefObject<HTMLButtonElement>;
}

const PrefsModal: React.FC<PrefsModalProps> = ({
    setShowPrefs,
    userCurrentContext,
    openModalRef,
}) => {
    const messageContext = useContext(MessageContext) as MessageContextType;

    const modalRef = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // If the user clicks outside of the modal, close it.
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !openModalRef.current?.contains(event.target as Node)
            ) {
                setShowPrefs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.prefsModal} ref={modalRef}>
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
