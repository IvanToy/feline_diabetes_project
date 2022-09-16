import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/user-action";

import styles from "../css/LoginForm.module.css";

const LoginPage = () => {
  const { loading, error } = useSelector((state) => state.ui);
  const isRegistered = useSelector((state) => state.user.isRegistered);
  const [enteredUserInfo, setEnteredUserInfo] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isRegistered) {
      navigate("/", { replace: true });
    }
  }, [isRegistered, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();

    dispatch(
      loginUser({
        email: enteredUserInfo.email,
        password: enteredUserInfo.password,
      })
    );

    enteredUserInfo.email = "";
    enteredUserInfo.password = "";
  };

  const changeHandler = (event) => {
    const { value, name } = event.target;

    setEnteredUserInfo((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className={styles.title}>Feline Diabetes Tracker</h1>
          {!loading && error && <span>{error}</span>}
          <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.registerFrom}>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={enteredUserInfo.email}
                autoComplete="off"
                onChange={changeHandler}
              />
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={enteredUserInfo.password}
                onChange={changeHandler}
              />

              <button className={styles.registerButton} type="submit">
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
        </>
      )}
    </>
  );
};

export default LoginPage;
