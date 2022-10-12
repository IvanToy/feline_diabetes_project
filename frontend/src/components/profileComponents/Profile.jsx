import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, deletePassword } from "../../store/actions/user-action.js";
import PasswordShowModal from "../UI/PasswordShowModal";

import styles from "../../css/Profile.module.css";

const Profile = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [showPassword, setShowPassword] = useState(false);
  const [hidePassword, setHidePassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.password) {
      setPassword(user.password);
      setHidePassword(true);
    }
  }, [user?.password]);

  const showPasswordHandler = () => {
    if (!hidePassword) {
      setShowPassword((prevValue) => !prevValue);
    } else {
      setPassword(null);
      setHidePassword(false);
      dispatch(deletePassword());
    }
  };

  return (
    <>
      {showPassword && (
        <PasswordShowModal
          showPassword={showPassword}
          togglePassword={showPasswordHandler}
        />
      )}
      <section className={styles.container}>
        <h1 className={styles.title}> {userInfo?.name}'s profile </h1>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <span className={styles.liSpan}> Name:</span> {userInfo?.name}
          </li>
          <li className={styles.li}>
            <span className={styles.liSpan}>Email:</span> {userInfo?.email}
          </li>
          <li className={styles.li} onClick={showPasswordHandler}>
            <span className={styles.passwordTip}>
              {hidePassword
                ? "click to hide password"
                : "click to view password"}
            </span>
            <span className={styles.liSpan}>Password:</span>
            {password ? password : "******"}
          </li>
        </ul>
        <div className={styles.buttonsContainer}>
          <button className={styles.updateButton}>Update Profile</button>
          <button className={styles.deleteButton}>Delete Profile</button>
        </div>
      </section>
    </>
  );
};

export default Profile;