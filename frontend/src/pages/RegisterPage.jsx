import React, { useEffect, useState } from "react";
import Loader from "../components/UI/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/actions/user-action";
import { isNotEmpty, isEmail, isPassword } from "../utils/validationFunctions";
import useFormValidation from "../hooks/useFormValidation";

import styles from "../css/RegisterFrom.module.css";

const RegisterPage = () => {
  const { loading, error } = useSelector((state) => state.ui.generalUI);
  const { isUserRegistered } = useSelector((state) => state.user.userState);
  const [isLoading, setIsLoading] = useState(true);
  const {
    value: nameEntered,
    isValid: nameEnteredIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useFormValidation(isNotEmpty);
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useFormValidation(isEmail);
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useFormValidation(isPassword);
  const {
    value: enteredConfirmPassword,
    isValid: enteredConfirmPasswordIsValid,
    hasError: confirmPasswordInputHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPasswordInput,
  } = useFormValidation(isPassword);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserRegistered) {
      navigate("/", { replace: true });
    }
  }, [isUserRegistered]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, []);

  let formIsValid = false;

  if (
    nameEnteredIsValid &&
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    enteredConfirmPasswordIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }
    if (enteredPassword !== enteredConfirmPassword) {
      setPasswordError(true);
      return;
    }
    dispatch(
      registerUser({
        name: nameEntered,
        email: enteredEmail,
        password: enteredPassword,
      })
    );

    resetNameInput();
    resetEmailInput();
    resetPasswordInput();
    resetConfirmPasswordInput();
  };

  const nameInputStyles = nameInputHasError ? styles.invalid : styles.input;
  const emailInputStyles = emailInputHasError ? styles.invalid : styles.input;
  const passwordInputStyle = passwordInputHasError
    ? styles.invalid
    : styles.input;

  const confirmPasswordInputStyle = confirmPasswordInputHasError
    ? styles.invalid
    : styles.input;

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : (
        <>
          {!loading && error && <h3 className={styles.errorText}>{error}</h3>}
          {passwordError && (
            <h3 className={styles.errorText}>Passwords do not match</h3>
          )}
          <>
            {isLoading ? (
              <div className={styles.loader}>
                <Loader />
              </div>
            ) : (
              <div className={styles.container}>
                <form onSubmit={submitHandler} className={styles.registerFrom}>
                  <input
                    className={nameInputStyles}
                    type="text"
                    placeholder="Name"
                    value={nameEntered}
                    autoComplete="off"
                    onChange={nameChangeHandler}
                    onBlur={nameBlurHandler}
                  />
                  {nameInputHasError && (
                    <span className={styles.errorText}>
                      Name must not be empty
                    </span>
                  )}
                  <input
                    className={emailInputStyles}
                    type="email"
                    placeholder="Email"
                    value={enteredEmail}
                    autoComplete="off"
                    onChange={emailChangeHandler}
                    onBlur={emailBlurHandler}
                  />
                  {emailInputHasError && (
                    <span className={styles.errorText}>Enter valid email</span>
                  )}
                  <input
                    className={passwordInputStyle}
                    type="password"
                    placeholder="Password"
                    value={enteredPassword}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                  />
                  {passwordInputHasError && (
                    <span className={styles.errorText}>
                      Password must:
                      <ul>
                        <li>be 8 or more characters long</li>
                        <li>
                          contain at least one upper case or lower case letter
                        </li>
                        <li>contain at least one number from 0 to 9</li>
                        <li>
                          contain at lest one of the following
                          symbols:!@#$%^&*()_+-
                        </li>
                      </ul>
                    </span>
                  )}
                  <input
                    className={confirmPasswordInputStyle}
                    type="password"
                    placeholder="Confirm Password"
                    value={enteredConfirmPassword}
                    onChange={confirmPasswordChangeHandler}
                    onBlur={confirmPasswordBlurHandler}
                  />
                  {confirmPasswordInputHasError && (
                    <span className={styles.errorText}>
                      Please confirm password
                    </span>
                  )}
                  <button
                    className={styles.registerButton}
                    type="submit"
                    disabled={!formIsValid}
                  >
                    Register
                  </button>
                </form>
                <p className={styles.p}>
                  Have an account ?
                  <Link className={styles.link} to="/login">
                    Log In
                  </Link>
                </p>
              </div>
            )}
          </>
        </>
      )}
    </>
  );
};

export default RegisterPage;
