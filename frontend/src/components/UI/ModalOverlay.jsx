import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getUsersPassword } from "../../store/actions/user-action.js";
import styles from "../../css/PasswordShowModal.module.css";

const ModalOverlay = ({ showPassword, togglePassword }) => {
  const [btnValue, setBtnValue] = useState(null);
  const passwordRef = useRef("");
  const dispatch = useDispatch();

  useEffect(() => {
    const dialog = document.getElementById("passwordDialog");
    if (showPassword) {
      dialog.showModal();
    }
  }, [showPassword]);

  const dialogHandler = (e) => {
    const { id } = e.target;
    const dialog = e.target;

    if (id === "passwordDialog") {
      dialog.close();
      togglePassword();
    }
  };

  const passwordHandler = (e) => {
    const enteredPassword = passwordRef.current.value;

    setBtnValue(enteredPassword);
  };

  const enteredPasswordHandler = (e) => {
    const { id } = e.target;
    const dialog = e.target;

    if (id === "passwordDialog") {
      dialog.close();
      dispatch(getUsersPassword(btnValue));
      togglePassword();
    }
  };

  return (
    <dialog
      id="passwordDialog"
      className={styles.modal}
      onClick={dialogHandler}
      onClose={enteredPasswordHandler}
    >
      <form className={styles.dialogForm} method="dialog">
        <label htmlFor="password" className={styles.dialogFormLabel}>
          Enter password to view password
        </label>
        <input
          type="password"
          id="password"
          ref={passwordRef}
          className={styles.dialogFormInput}
          onBlur={passwordHandler}
          required
        />
        <button className={styles.dialogFormButton} value={btnValue}>
          Submit
        </button>
      </form>
    </dialog>
  );
};

export default ModalOverlay;
