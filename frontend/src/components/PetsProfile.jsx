import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import { getPetsProfile } from "../store/actions/pet-action";

import styles from "../css/PetsProfile.module.css";

const PetsProfile = ({ toUpdateHandler }) => {
  const { loading, error } = useSelector((state) => state.ui);
  const pet = useSelector((state) => state.pet.petsInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPetsProfile("petsProfile"));
  }, []);

  let content;

  if (!pet && loading) {
    content = <Loader />;
  } else if (pet && !loading) {
    content = (
      <div className={styles.container}>
        <h1 className={styles.title}>sammy's Profile</h1>
        <div className={styles.mainInfo}>
          <div className={styles.general}>
            <h3 className={styles.generalTitle}>General Information</h3>
            <ul className={styles.generalList}>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>Age:</span>
                {pet.age === 1 ? `${pet.age} year old` : `${pet.age} years old`}
              </li>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>Sex:</span> {pet.sex}
              </li>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>Breed:</span>
                {pet.breed}
              </li>
            </ul>
          </div>
          <button className={styles.updateButton} onClick={toUpdateHandler}>
            Update Profile
          </button>
          <button className={styles.deleteButton}>Delete Profile</button>
          <div className={styles.medical}>
            <h3 className={styles.medicalTitle}>Medical Information</h3>
            <ul>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>Diagnosed at:</span>
                {pet.diagnosed.split("-").join("/")}
              </li>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>Dosing Method:</span>
                {pet.dosingMethod}
              </li>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>
                  Dosing Method Started :
                </span>
                {pet.dosingDate.split("-").join("/")}
              </li>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>Current Insulin</span>

                {pet.currentInsulin}
              </li>
              <li className={styles.generalItem}>
                <span className={styles.generalItemSpan}>Meter:</span>
                {pet.meter}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (!loading && error) {
    content = <span>{error}</span>;
  }

  return <>{content}</>;
};

export default PetsProfile;
