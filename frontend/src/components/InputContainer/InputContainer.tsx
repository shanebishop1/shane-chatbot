import styles from './InputContainer.module.css';
import userProfile from '../../assets/userProfile.png';
import { HiOutlineCog } from 'react-icons/hi';
import { LuSendHorizonal } from 'react-icons/lu';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

const InputContainer = () => {
  return (
    <div className={styles.inputVerticalContainer}>
      <div className={styles.inputProfileTextContainer}>
        <ProfilePicture src={userProfile} imageType="User" />
        <div className={styles.inputTextBoxContainer}>
          <form>
            <textarea placeholder="Your question" />
          </form>
        </div>
      </div>
      <div className={styles.inputOptionsContainer}>
        <div
          className={`${styles.inputOptionsCol} ${styles.inputOptionsColLeft}`}
        >
          <div>Context</div>
          <select className={styles.contextSelect}>
            <option value="onboarding">Onboarding</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div
          className={`${styles.inputOptionsCol} ${styles.inputOptionsColRight}`}
        >
          <button type="button">
            <HiOutlineCog className={styles.gearIcon} />
          </button>
          <button type="submit">
            <LuSendHorizonal className={styles.sendIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputContainer;
