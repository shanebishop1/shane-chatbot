import React, { useEffect, useRef, useState } from 'react';
import styles from './InputContainer.module.css';
import userProfile from '../../assets/userProfile.png';
import { HiOutlineCog } from 'react-icons/hi';
import { LuSendHorizonal } from 'react-icons/lu';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { useMessages } from '../../context/messageContext';
import {
  Message,
  MessageContextType,
  UserInfoContextType,
} from '../../types/types';
import { postChat } from '../../api/chat';
import { isIOSDevice } from '../../utils/utils';
import PrefsModal from '../PrefsModal/PrefsModal';
import { getChatThreadByContext } from '../../api/chat';
import { useUserInfo } from '../../context/userInfoContext';

const InputContainer: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const openModalButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showPrefs, setShowPrefs] = useState<boolean>(false);
  const [userCurrentText, setUserCurrentText] = useState<string>('');
  const [userCurrentContext, setUserCurrentContext] =
    useState<string>('onboarding');

  const { setMessages, pushMessage } = useMessages() as MessageContextType;
  const { accessToken } = useUserInfo() as UserInfoContextType;

  useEffect(() => {
    const updateChatThread = async () => {
      const chatThread: Message[] = await getChatThreadByContext(
        userCurrentContext,
        accessToken,
      );
      setMessages(chatThread);
    };
    updateChatThread();
  }, [userCurrentContext]);

  const onSubmit = async () => {
    // On iOS, make the keyboard disappear
    if (textAreaRef.current && isIOSDevice()) {
      textAreaRef.current.blur();
    }
    // Add the user message to the chat
    const userMessage = {
      id: Math.round(Math.random() * 10000),
      sender: 'user',
      text: userCurrentText,
      context: userCurrentContext,
      timestamp: new Date().toISOString(),
    } as Message;
    pushMessage(userMessage);

    // Clear the input field
    setUserCurrentText('');

    try {
      // Add the LLM response to the chat
      const llmResponseMessage: Message | null = await postChat(
        userMessage,
        accessToken,
      );
      if (llmResponseMessage) {
        pushMessage(llmResponseMessage);
      }
    } catch (error) {
      console.error('Error getting LLM response', error);
    }
  };

  return (
    <div data-testid="inputContainer" className={styles.inputVerticalContainer}>
      <div className={styles.inputProfileTextContainer}>
        <ProfilePicture src={userProfile} imageType="User" />
        <div className={styles.inputTextBoxContainer}>
          <form onSubmit={onSubmit}>
            <textarea
              ref={textAreaRef}
              placeholder="Your question"
              value={userCurrentText}
              onChange={(e) => setUserCurrentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // prevent the default action (new line)
                  onSubmit();
                }
              }}
            />
          </form>
        </div>
      </div>
      <div className={styles.inputOptionsContainer}>
        <div
          className={`${styles.inputOptionsCol} ${styles.inputOptionsColLeft}`}
        >
          <div>Context</div>
          <select
            value={userCurrentContext}
            className={styles.contextSelect}
            onChange={(e) => setUserCurrentContext(e.target.value)}
          >
            <option value="onboarding">Onboarding</option>
            <option value="my_account">My Account</option>
            <option value="strategy">Strategy</option>
          </select>
        </div>
        <div
          className={`${styles.inputOptionsCol} ${styles.inputOptionsColRight}`}
        >
          <button
            ref={openModalButtonRef}
            type="button"
            onClick={() => setShowPrefs(!showPrefs)}
          >
            <HiOutlineCog className={styles.gearIcon} />
          </button>
          <button type="submit" onClick={onSubmit}>
            <LuSendHorizonal className={styles.sendIcon} />
          </button>
        </div>
      </div>
      {showPrefs && (
        <PrefsModal
          userCurrentContext={userCurrentContext}
          setShowPrefs={setShowPrefs}
          openModalButtonRef={openModalButtonRef}
        />
      )}
    </div>
  );
};

export default InputContainer;
