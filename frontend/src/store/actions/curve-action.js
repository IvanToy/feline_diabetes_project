import axios from "axios";
import jwt_decode from "jwt-decode";
import { curveActions } from "../slices/curve-slice";
import { uiActions } from "../slices/ui-slice";
import { userActions } from "../slices/user-slice";

const refreshToken = async () => {
  try {
    const { refreshToken } = JSON.parse(localStorage.getItem("userState"));

    const response = await axios.post("http://localhost:4000/api/refresh", {
      token: refreshToken,
    });
    const { data } = response;

    const userState = JSON.parse(localStorage.getItem("userState"));

    userState.accessToken = data.accessToken;
    userState.refreshToken = data.refreshToken;

    localStorage.setItem("userState", JSON.stringify(userState));
    return data;
  } catch (error) {
    console.error(error);
  }
};

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const { accessToken } = JSON.parse(localStorage.getItem("userState"));
    const decodedToken = jwt_decode(accessToken);

    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const data = await refreshToken();

      config.headers["authorization"] = `Bearer ${data.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const addCurve = (glucoseInfo) => {
  return async (dispatch) => {
    const add = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );

      const response = await axiosJWT.post(
        "http://localhost:4000/api/curve",
        glucoseInfo,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }

      const { data } = response;

      return data;
    };

    try {
      const charDataState = await add();

      if (charDataState.hasChartData) {
        dispatch(
          userActions.setChartData({ hasChartData: charDataState.hasChartData })
        );
        dispatch(curveActions.cleanCurve({ curveInfo: null }));

        const userState = JSON.parse(localStorage.getItem("userState"));

        userState.hasChartData = charDataState.hasChartData;

        localStorage.setItem("userState", JSON.stringify(userState));
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "chart" }));
    }
  };
};

export const getCurve = (id) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "chart" }));
    const get = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );

      const response = await axiosJWT.get(
        `http://localhost:4000/api/curve/${id}`,
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }

      const { data } = response;

      return data;
    };

    try {
      const chartData = await get();

      if (chartData) {
        dispatch(curveActions.getCurve({ chartData }));
        dispatch(uiActions.success({ loading: false, type: "chart" }));
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "chart" }));
    }
  };
};
