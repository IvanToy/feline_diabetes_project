import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUser,
  updateUser,
  updateUserProfile,
} from "../../store/actions/user-action";
import {
  isNotEmpty,
  isEmail,
  isPassword,
} from "../../utils/validationFunctions";
import useFormValidation from "../../hooks/useFormValidation";

import styles from "../../css/UpdateProfileForm.module.css";
import Loader from "../UI/Loader";

const UpdateProfileForm = () => {
  const { loading, error } = useSelector((state) => state.ui.generalUI);
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useSelector((state) => state.user.userInfo);
  const updateProfile = useSelector((state) => state.user.updateProfile);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, []);

  useEffect(() => {
    if (updateProfile) {
      navigate("/profile");
      dispatch(updateUserProfile());
    }
  }, [updateProfile]);

  useEffect(() => {
    if (!userInfo) {
      dispatch(getUser());
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      setUser((prevState) => {
        return {
          name: userInfo.name,
          email: userInfo.email,
          password: prevState.password,
          confirmPassword: prevState.confirmPassword,
        };
      });
    }
  }, [userInfo]);

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const updatedUserInfo = {};

    for (let key in user) {
      if (key === "name") {
        if (user[key] !== userInfo[key]) updatedUserInfo[key] = user[key];
      }

      if (key === "email") {
        if (user[key] !== userInfo[key]) updatedUserInfo[key] = user[key];
      }

      if (key === "password") {
        if (user[key]) updatedUserInfo[key] = user[key];
      }
    }

    dispatch(updateUser(updatedUserInfo));

    user.name = "";
    user.email = "";
    user.password = "";
    user.confirmPassword = "";
  };

  return (
    <>
      {isLoading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : (
        <>
          {error && <h3 className={styles.errorText}>{error}</h3>}
          <section className={styles.container}>
            <h1 className={styles.title}>Update Profile</h1>
            <form className={styles.form} onSubmit={submitHandler}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  autoComplete="off"
                  defaultValue={user.name}
                  onChange={changeHandler}
                />
                <label className={styles.label} id="email">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  defaultValue={user.email}
                  onChange={changeHandler}
                />
              </div>
              <button type="submit" className={styles.button}>
                Update
              </button>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  defaultValue={user.password}
                  onChange={changeHandler}
                />
                <label className={styles.label} htmlFor="confirmPassword">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={styles.input}
                  defaultValue={user.confirmPassword}
                  onChange={changeHandler}
                />
              </div>
            </form>
          </section>
        </>
      )}
    </>
  );
};

export default UpdateProfileForm;
