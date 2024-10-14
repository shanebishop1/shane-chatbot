import styles from './InputContainer.module.css';
import reactLogo from '../../assets/react.svg';
import { HiOutlineCog } from 'react-icons/hi';
import { LuSendHorizonal } from 'react-icons/lu';

const InputContainer = () => {
  return (
    <div className={styles.inputVerticalContainer}>
      <div className={styles.inputProfileTextContainer}>
        <div className={styles.userProfileImgContainer}>
          <div>
            <img src={reactLogo} className="logo react" alt="React logo" />
          </div>
        </div>
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
