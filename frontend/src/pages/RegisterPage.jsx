import React, { useEffect, useState } from "react";
import Loader from "../components/UI/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/actions/user-action";

import styles from "../css/RegisterFrom.module.css";

// const isNotEmpty = (value) => value.trim !== "";
// const isPassword = (value) =>
//   value.length > 8 && value.match(/([Aa-zZ]|[0-9]|[!@#$%^&*()_+-])/g);
// const isEmail = (value) =>
//   value.match(
//     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
//   );

const RegisterPage = () => {
  const { loading, error } = useSelector((state) => state.ui);
  const isRegistered = useSelector((state) => state.user.isRegistered);
  const [enteredUserInfo, setEnteredUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      registerUser({
        name: enteredUserInfo.name,
        email: enteredUserInfo.email,
        password: enteredUserInfo.password,
      })
    );

    enteredUserInfo.name = "";
    enteredUserInfo.email = "";
    enteredUserInfo.password = "";
    enteredUserInfo.confirmPassword = "";
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
          {!loading && error && <span>{error}</span>}
          <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.registerFrom}>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Name"
                value={enteredUserInfo.name}
                autoComplete="off"
                onChange={changeHandler}
              />
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
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={enteredUserInfo.confirmPassword}
                onChange={changeHandler}
              />
              <button className={styles.registerButton} type="submit">
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
        </>
      )}
    </>
  );
};

export default RegisterPage;
