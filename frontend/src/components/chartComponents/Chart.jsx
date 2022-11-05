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
import { gradientOffset } from "../../utils/gradientOffset";

import styles from "../../css/Chart.module.css";

const Chart = () => {
  const { hasChartData } = useSelector((state) => state.user.userState);
  const { loading, error } = useSelector((state) => state.ui.chartUI);
  const curveInfo = useSelector((state) => state.curve.curveInfo);
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(-1);
  const [isChartData, setIsChartData] = useState({
    next: true,
    previous: true,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.curveLength === 1) {
      setIsChartData(() => {
        return {
          next: false,
          previous: false,
        };
      });
    } else if (data?.id === 0 && data?.id < data?.curveLength - 1) {
      setIsChartData(() => {
        return {
          next: true,
          previous: false,
        };
      });
    } else if (data?.id === data?.curveLength - 1 && data?.id > 0) {
      setIsChartData(() => {
        return {
          next: false,
          previous: true,
        };
      });
    }
  }, [data]);

  useEffect(() => {
    if (hasChartData && !data) {
      dispatch(getCurve(index));
    }
  }, [hasChartData, data, index]);

  useEffect(() => {
    if (curveInfo) {
      setData(curveInfo);
    }
  }, [curveInfo]);

  const graphLoaderHandler = (e) => {
    const { id } = e.target;

    if (id === "prev") {
      setIndex(data.id - 1);
      setData(null);
    }
    if (id === "next") {
      setIndex(data.id + 1);
      setData(null);
    }
  };

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.loader}>
          <Loader />
        </div>
      </section>
    );
  }

  if (!loading && !data) {
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

  const isPrevArrowValid = isChartData.previous === false ? true : false;
  const isNextArrowValid = isChartData.next === false ? true : false;

  const off = gradientOffset(data?.levels);
  //console.log(off);
  if (!loading && data) {
    return (
      <section className={styles.container}>
        <h4 className={styles.title}>
          Graph for {data?.date.split("-")[2]}/{data?.date.split("-")[1]}/
          {data?.date.split("-")[0]}
        </h4>
        <div className={styles.chartContainer}>
          <button
            className={styles.arrow}
            onClick={graphLoaderHandler}
            id="prev"
            type="button"
            disabled={isPrevArrowValid}
          >
            &#10151;
            <span className={styles.arrowTip}>
              {isChartData.previous
                ? "Load graph for the previous available date"
                : "No graph available for the previous date"}
            </span>
          </button>
          <LineChart
            width={800}
            height={250}
            data={data.levels}
            className={styles.chart}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="time" />
            <YAxis ticks={[0, 100, 200, 300, 400, 500]} />
            <Tooltip />
            <Legend />
            <defs>
              <linearGradient id="diffColors" x1="0" y1="0" x2="0" y2="1">
                <stop offset={0.2} stopColor="red" />
                <stop offset={0.3} stopColor="purple" />
                <stop offset={0.4} stopColor="yellow" />
                <stop offset={0.5} stopColor="orange" />
                <stop offset={0.6} stopColor="green" />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="level" stroke="url(#diffColors)" />
          </LineChart>
          <button
            className={styles.arrow}
            onClick={graphLoaderHandler}
            id="next"
            type="button"
            disabled={isNextArrowValid}
          >
            &#10151;
            <span className={styles.arrowTip}>
              {isChartData.next
                ? "Load graph for the next available date"
                : "No graph available for the next date"}
            </span>
          </button>
        </div>
      </section>
    );
  }
};

export default Chart;
