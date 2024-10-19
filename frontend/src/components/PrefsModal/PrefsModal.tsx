import { FaRegTrashCan } from 'react-icons/fa6';
import React, { useContext, useEffect } from 'react';
import styles from './PrefsModal.module.css';
import { MessageContext } from '../../context/messageContext';
import { MessageContextType, UserInfoContextType } from '../../types/types';
import { deleteChatThreadByContext } from '../../api/chat';
import { useUserInfo } from '../../context/userInfoContext';

interface PrefsModalProps {
  setShowPrefs: React.Dispatch<React.SetStateAction<boolean>>;
  userCurrentContext: string;
  openModalButtonRef: React.RefObject<HTMLButtonElement>;
}

const PrefsModal: React.FC<PrefsModalProps> = ({
  setShowPrefs,
  userCurrentContext,
  openModalButtonRef,
}) => {
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const { clearMessages } = useContext(MessageContext) as MessageContextType;
  const { accessToken } = useUserInfo() as UserInfoContextType;

  useEffect(() => {
    // If the user clicks outside of the modal, close it.
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !openModalButtonRef.current?.contains(event.target as Node)
      ) {
        setShowPrefs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openModalButtonRef, setShowPrefs]);

  return (
    <div className={styles.prefsModal} ref={modalRef}>
      <div className={styles.prefContainer}>
        <button
          type="button"
          className={styles.prefButton}
          onClick={() => {
            clearMessages();
            deleteChatThreadByContext(userCurrentContext, accessToken);
            setShowPrefs(false);
          }}
        >
          <FaRegTrashCan className={styles.prefIcon} />
          Clear Context
        </button>
      </div>
    </div>
  );
};

export default PrefsModal;
