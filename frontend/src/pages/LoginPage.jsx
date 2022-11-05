import React, { useEffect, useState } from "react";
import Loader from "../components/UI/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/user-action";
import { isEmail, isPassword } from "../utils/validationFunctions";
import useFormValidation from "../hooks/useFormValidation";

import styles from "../css/LoginForm.module.css";

const LoginPage = () => {
  const { loading, error } = useSelector((state) => state.ui.generalUI);
  const { isUserRegistered } = useSelector((state) => state.user.userState);
  const [isLoading, setIsLoading] = useState(true);
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
  if (enteredEmailIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    dispatch(
      loginUser({
        email: enteredEmail,
        password: enteredPassword,
      })
    );

    resetEmailInput();
    resetPasswordInput();
  };

  const emailInputStyles = emailInputHasError ? styles.invalid : styles.input;
  const passwordInputStyle = passwordInputHasError
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
          <>
            {isLoading ? (
              <div className={styles.loader}>
                <Loader />
              </div>
            ) : (
              <div className={styles.container}>
                <form onSubmit={submitHandler} className={styles.registerFrom}>
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
                    <span className={styles.errorText}>
                      Name must not be empty
                    </span>
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
                      Password is not correct
                    </span>
                  )}
                  <button
                    className={styles.registerButton}
                    type="submit"
                    disabled={!formIsValid}
                  >
                    Log In
                  </button>
                </form>
                <p className={styles.p}>
                  Don't have an account ?
                  <Link className={styles.link} to="/register">
                    Register
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

export default LoginPage;
