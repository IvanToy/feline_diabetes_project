import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/actions/user-action";

import styles from "../css/Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUserRegistered } = useSelector((state) => state.user.userState);

  useEffect(() => {
    if (!isUserRegistered) {
      navigate("/", { replace: true });
    }
  }, [isUserRegistered]);

  const clickHandler = () => {
    dispatch(logoutUser());
  };

  return (
    <header className={styles.header}>
      <h3 className={styles.title}>
        <Link className={styles.link} to="/">
          Feline Diabetes Tracker
        </Link>
      </h3>
      {isUserRegistered && (
        <div className={styles.menu}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <Link className={styles.listItemLink} to="/profile">
                Your Profile
              </Link>
            </li>
            <li className={styles.listItem}>
              <Link className={styles.listItemLink} to="/chat">
                Chat
              </Link>
            </li>
            <li className={styles.listItem}>
              <button className={styles.logout} onClick={clickHandler}>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
