import React, { useState } from "react";
import { addCurve } from "../store/actions/curve-action";
import { useDispatch } from "react-redux";
import styles from "../css/PetsChart.module.css";

const currentDate = new Date().toISOString().split("T")[0];

const PetsChartForm = () => {
  const [glucoseInfo, setGlucoseInfo] = useState({
    date: "",
    time: "",
    glucose: 0,
    units: 0,
  });
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(addCurve(glucoseInfo));
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setGlucoseInfo((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  return (
    <section className={styles.container}>
      <form className={styles.formInfo} onSubmit={submitHandler}>
        <label className={styles.formInfoLabel} htmlFor="date">
          Add Date:
        </label>
        <input
          type="date"
          id="date"
          name="date"
          max={currentDate}
          className={styles.formInfoInput}
          value={glucoseInfo.date}
          onChange={changeHandler}
          required
        />
        <label className={styles.formInfoLabel} htmlFor="time">
          Add Time:
        </label>
        <input
          type="time"
          id="time"
          name="time"
          className={styles.formInfoInput}
          value={glucoseInfo.time}
          onChange={changeHandler}
          required
        />
        <label className={styles.formInfoLabel} htmlFor="glucose">
          Add Glucose Level:
        </label>
        <input
          type="number"
          id="glucose"
          name="glucose"
          min="0"
          step=".01"
          className={styles.formInfoInput}
          value={glucoseInfo.glucose}
          onChange={changeHandler}
          required
        />
        <label className={styles.formInfoLabel} htmlFor="units">
          Add Units:
        </label>
        <input
          type="number"
          id="units"
          name="units"
          min="0"
          step=".01"
          value={glucoseInfo.units}
          onChange={changeHandler}
          className={styles.formInfoInput}
        />

        <button className={styles.formInfoButton} type="submit">
          Submit
        </button>
      </form>

      <form className={styles.formUpload}>
        <label className={styles.formUploadLabel}>
          Click to upload
          <input type="file" className={styles.formUploadInput} />
          <span className={styles.formUploadSymbol}> &#128195;</span>
        </label>
      </form>
    </section>
  );
};

export default PetsChartForm;
