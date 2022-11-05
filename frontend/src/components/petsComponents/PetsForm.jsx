import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPetsProfile,
  updatedPetsProfile,
  getPetsProfile,
} from "../../store/actions/pet-action";
import Loader from "../UI/Loader";
import styles from "../../css/PetsForm.module.css";

const currentDate = new Date().toISOString().split("T")[0];

const PetsForm = () => {
  const { loading, error } = useSelector((state) => state.ui.generalUI);
  const { petsProfileExists, petsInfo } = useSelector((state) => state.pet);
  const [isLoading, setIsLoading] = useState(true);
  const [petsData, setPetsData] = useState({
    name: "",
    sex: "",
    age: "",
    breed: "",
    diagnosed: "",
    dosingMethod: "",
    dosingDate: "",
    currentInsulin: "",
    meter: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, []);

  useEffect(() => {
    if (!petsInfo && petsProfileExists) {
      dispatch(getPetsProfile("petsProfile"));
    }
    if (petsInfo && petsProfileExists) {
      setPetsData({
        name: petsInfo.name,
        sex: petsInfo.sex,
        age: petsInfo.age,
        breed: petsInfo.breed,
        diagnosed: petsInfo.diagnosed,
        dosingMethod: petsInfo.dosingMethod,
        dosingDate: petsInfo.dosingDate,
        currentInsulin: petsInfo.currentInsulin,
        meter: petsInfo.meter,
      });
    }
  }, [petsProfileExists, petsInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!petsInfo) {
      dispatch(createPetsProfile(petsData));
    } else {
      const updatedPetsData = {};
      for (let key in petsInfo) {
        if (petsInfo[key] !== petsData[key])
          updatedPetsData[key] = petsData[key];
      }

      dispatch(updatedPetsProfile(updatedPetsData));
    }

    for (let key in petsData) {
      petsData[key] = "";
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setPetsData((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  let content;

  if (loading) {
    content = (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  } else {
    content = (
      <>
        {isLoading ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          <>
            {error && <h3 className={styles.errorText}>{error}</h3>}
            <div className={styles.container}>
              <h1 className={styles.title}>
                {petsInfo
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
                    value={petsData.name}
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
                    value={petsData.sex}
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
                    value={petsData.age}
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
                    value={petsData.breed}
                    onChange={changeHandler}
                  />
                </div>
                <button type="submit" className={styles.button}>
                  {petsInfo ? "Update" : "Save"}
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
                    value={petsData.diagnosed}
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
                      value={petsData.dosingMethod}
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
                      value={petsData.dosingDate}
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
                    value={petsData.currentInsulin}
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
                    value={petsData.meter}
                    onChange={changeHandler}
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>
          </>
        )}
      </>
    );
  }

  return content;
};

export default PetsForm;
