import React from "react";
import { updatePet, deletePetsProfile } from "../../store/actions/pet-action";
import styles from "../../css/PetsProfile.module.css";
import { useDispatch } from "react-redux";

const PetsGeneralInfo = ({ pet }) => {
  const dispatch = useDispatch();
  const updateHandler = () => {
    dispatch(updatePet());
  };

  const [y1, m1, d1] = pet?.diagnosed.split("-");
  const [y2, m2, d2] = pet?.dosingDate.split("-");

  const deleteHandler = () => {
    dispatch(deletePetsProfile());
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{pet.name}'s Profile</h1>
      <section className={styles.mainInfo}>
        <div className={styles.general}>
          <h3 className={styles.generalTitle}>General Information</h3>
          <ul>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>Age: </span>
              {pet?.age}
            </li>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>Sex: </span>
              {pet?.sex}
            </li>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>Breed: </span>
              {pet?.breed}
            </li>
          </ul>
        </div>
        <button className={styles.updateButton} onClick={updateHandler}>
          Update Profile
        </button>
        <button className={styles.deleteButton} onClick={deleteHandler}>
          Delete Profile
        </button>
        <div className={styles.medical}>
          <h3 className={styles.medicalTitle}>Medical Information</h3>
          <ul>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>Diagnosed: </span>
              {pet?.diagnosed && `${d1}/${m1}/${y1}`}
            </li>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>Dosing Method: </span>
              {pet?.dosingMethod}
            </li>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>Dosing Date: </span>
              {pet?.dosingDate && `${d2}/${m2}/${y2}`}
            </li>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>current Insulin: </span>
              {pet?.currentInsulin}
            </li>
            <li className={styles.ulItem}>
              <span className={styles.itemSpan}>Meter: </span>
              {pet?.meter}
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default PetsGeneralInfo;
