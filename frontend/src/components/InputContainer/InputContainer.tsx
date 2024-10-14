import React, { useContext, useRef, useState } from 'react';
import styles from './InputContainer.module.css';
import userProfile from '../../assets/userProfile.png';
import { HiOutlineCog } from 'react-icons/hi';
import { LuSendHorizonal } from 'react-icons/lu';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { MessageContext } from '../../context/messageContext';
import { Message, MessageContextType } from '../../types/types';
import { postChat } from '../../api/chat';
import { isIOSDevice } from '../../utils/utils';
import PrefsModal from '../PrefsModal/PrefsModal';

const InputContainer = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showPrefs, setShowPrefs] = useState<boolean>(false);
  const [userCurrentText, setUserCurrentText] = useState<string>('');
  const [userCurrentContext, setUserCurrentContext] =
    useState<string>('onboarding');
  const messageContext = useContext(MessageContext) as MessageContextType;
  const { messages } = messageContext;
  const { pushMessage } = messageContext;

  const onSubmit = async () => {
    // Make the iOS keyboard disappear
    if (textAreaRef.current && isIOSDevice()) {
      textAreaRef.current.blur();
    }
    // Add the user message to the chat
    const timestamp = new Date().getTime();
    const userMessage = {
      id: timestamp - Math.round(Math.random() * 10),
      sender: 'user',
      text: userCurrentText,
      context: userCurrentContext,
      timestamp,
    } as Message;
    pushMessage(userMessage);

    // Clear the input field
    setUserCurrentText('');

    try {
      // Add the LLM response to the chat
      const out = await postChat(userMessage);
      pushMessage(out);
    } catch (error) {
      console.error('Error getting LLM response', error);
    }
  };

  return (
    <div className={styles.inputVerticalContainer}>
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
          <button type="button" onClick={() => setShowPrefs(!showPrefs)}>
            <HiOutlineCog className={styles.gearIcon} />
          </button>
          <button type="submit" onClick={onSubmit}>
            <LuSendHorizonal className={styles.sendIcon} />
          </button>
        </div>
      </div>
      {showPrefs && <PrefsModal setShowPrefs={setShowPrefs} />}
    </div>
  );
};

export default InputContainer;
