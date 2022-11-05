import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  deletePassword,
  deleteUser,
} from "../../store/actions/user-action.js";
import Loader from "../UI/Loader";
import LoaderPassword from "../UI/LoaderPassword.jsx";
import PasswordShowModal from "../UI/PasswordShowModal";

import styles from "../../css/Profile.module.css";

const Profile = () => {
  const { loading, error } = useSelector((state) => state.ui.generalUI);
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

  const deleteProfileHandler = () => {
    dispatch(deleteUser());
  };

  return (
    <>
      {showPassword && (
        <PasswordShowModal
          showPassword={showPassword}
          togglePassword={showPasswordHandler}
        />
      )}
      {loading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : (
        <>
          {error && <h3 className={styles.errorText}>{error}</h3>}
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
                {password ? password : " ****"}
              </li>
            </ul>
            <div className={styles.buttonsContainer}>
              <Link to="/update-profile">
                <button className={styles.updateButton}>Update Profile</button>
              </Link>
              <button
                className={styles.deleteButton}
                onClick={deleteProfileHandler}
              >
                Delete Profile
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Profile;
