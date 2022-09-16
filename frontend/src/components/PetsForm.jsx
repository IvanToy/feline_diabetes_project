import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPetsProfile, getPetsProfile } from "../store/actions/pet-action";
import styles from "../css/PetsForm.module.css";
import Loader from "./Loader";

const currentDate = new Date().toISOString().split("T")[0];

const update = localStorage.getItem("toUpdate")
  ? JSON.parse(localStorage.getItem("toUpdate"))
  : false;

const PetsForm = () => {
  const loading = useSelector((state) => state.ui.loading);
  const pet = useSelector((state) => state.pet.petsInfo);
  const [petsInfo, setPetsInfo] = useState({
    name: "",
    sex: "",
    age: 0,
    breed: "",
    diagnosed: "",
    dosingMethod: "",
    dosingDate: "",
    currentInsulin: "",
    meter: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (update) {
      dispatch(getPetsProfile("petsProfile"));
    }
  }, [update]);

  useEffect(() => {
    if (update && pet) {
      setPetsInfo({
        name: pet.name,
        sex: pet.sex,
        age: pet.age,
        breed: pet.breed,
        diagnosed: pet.diagnosed,
        dosingDate: pet.dosingDate,
        dosingMethod: pet.dosingMethod,
        meter: pet.meter,
        currentInsulin: pet.currentInsulin,
      });
    }
  }, [pet]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!update) {
      dispatch(createPetsProfile(petsInfo));
    } else {
      const updatedPetsInfo = {};
      for (let key in petsInfo) {
        if (petsInfo[key] !== pet[key]) updatedPetsInfo[key] = petsInfo[key];
        //dispatch()
      }
      console.log(updatedPetsInfo);
    }

    for (let key in petsInfo) {
      petsInfo[key] = "";
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setPetsInfo((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>
            {update
              ? `Update ${petsInfo.name}'s Profile`
              : "Add Your Cat's Profile"}
          </h1>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.general}>
              <h3 className={styles.sectionTitle}>General Information</h3>
              <label className={styles.label} htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className={styles.input}
                autoComplete="off"
                value={petsInfo.name}
                onChange={changeHandler}
              />
              <label className={styles.label} htmlFor="sex">
                Sex:
              </label>
              <select
                name="sex"
                id="sex"
                className={styles.input}
                onChange={changeHandler}
                value={petsInfo.sex}
              >
                <option hidden value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label className={styles.label} htmlFor="age">
                Age:
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                name="age"
                id="age"
                className={styles.input}
                value={petsInfo.age}
                onChange={changeHandler}
              />
              <label className={styles.label} htmlFor="breed">
                Breed:
              </label>
              <input
                className={styles.input}
                type="text"
                name="breed"
                id="breed"
                autoComplete="off"
                value={petsInfo.breed}
                onChange={changeHandler}
              />
            </div>
            <button type="submit" className={styles.button}>
              {update ? "Update" : "Save"}
            </button>
            <div className={styles.medical}>
              <h3 className={styles.sectionTitle}>Medical Information</h3>
              <label className={styles.label} htmlFor="diagnosed">
                Diagnosed:
              </label>
              <input
                type="date"
                name="diagnosed"
                id="diagnosed"
                max={currentDate}
                value={update ? petsInfo.diagnosed : petsInfo.diagnosed}
                className={styles.input}
                onChange={changeHandler}
              />
              <label className={styles.label} htmlFor="dosingMethod">
                Dosing Method:
              </label>
              <div className={styles.dosingMethodInputs}>
                <select
                  name="dosingMethod"
                  id="dosingMethod"
                  className={styles.input}
                  onChange={changeHandler}
                  value={petsInfo.dosingMethod}
                >
                  <option hidden value=""></option>
                  <option value="SLGS">SLGS</option>
                  <option value="TR">TR</option>
                </select>

                <input
                  type="date"
                  name="dosingDate"
                  id="dosingMethod"
                  max={currentDate}
                  value={update ? petsInfo.dosingDate : petsInfo.dosingDate}
                  className={styles.dateForDosing}
                  onChange={changeHandler}
                />
              </div>
              <label className={styles.label} htmlFor="insulin">
                Current insulin:
              </label>
              <input
                type="text"
                name="currentInsulin"
                id="insulin"
                className={styles.input}
                value={petsInfo.currentInsulin}
                onChange={changeHandler}
                autoComplete="off"
              />
              <label className={styles.label} htmlFor="meter">
                Meter:
              </label>
              <input
                type="text"
                name="meter"
                id="meter"
                className={styles.input}
                value={petsInfo.meter}
                onChange={changeHandler}
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PetsForm;
