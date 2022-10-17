import React, { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Legend,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getCurve } from "../../store/actions/curve-action";
import Loader from "../UI/Loader";

import styles from "../../css/Chart.module.css";

const Chart = () => {
  const { loadingChart, loading } = useSelector((state) => state.ui);
  const curveInfo = useSelector((state) => state.curve.curveInfo);
  const [data, SetData] = useState(null);
  const [index, setIndex] = useState(-1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loadingChart) {
      dispatch(getCurve(index));
    }
  }, [loadingChart, index]);

  useEffect(() => {
    if (curveInfo) {
      SetData(curveInfo);
    }
  }, [curveInfo]);

  const graphLoaderHandler = (e) => {
    const { id } = e.target;

    if (id === "prev") {
      setIndex(data.id - 1);
    }
    if (id === "next") {
      setIndex(data.id + 1);
    }
  };

  if (loadingChart) {
    return (
      <section className={styles.container}>
        <Loader />
      </section>
    );
  }

  if (!loadingChart && !data) {
    return (
      <section className={styles.container}>
        {loading && !data ? (
          <Loader />
        ) : (
          <h4 className={styles.mainTitle}>
            Add information or upload google sheet to generate a graph.
          </h4>
        )}
      </section>
    );
  }

  if (!loadingChart && data) {
    return (
      <section className={styles.container}>
        <h4 className={styles.title}>Graph for {data.date}</h4>
        <div className={styles.chartContainer}>
          <div className={styles.arrow} onClick={graphLoaderHandler} id="prev">
            &#10151;
            <span className={styles.arrowTip}>
              Load graph for the previous available date
            </span>
          </div>
          <LineChart
            width={800}
            height={250}
            data={data.levels}
            className={styles.chart}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="level" stroke="#82ca9d" />
          </LineChart>
          <div className={styles.arrow} onClick={graphLoaderHandler} id="next">
            &#10151;
            <span className={styles.arrowTip}>
              Load graph for the next available date
            </span>
          </div>
        </div>
      </section>
    );
  }
};

export default Chart;
