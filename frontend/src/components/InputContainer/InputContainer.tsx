import styles from './InputContainer.module.css';

const InputContainer = () => {
  return (
    <div className={styles.inputVerticalContainer}>
      <div className={styles.inputTextContainer}> </div>
      <div className={styles.inputOptionsContainer}> </div>
    </div>
  );
};

export default InputContainer;
