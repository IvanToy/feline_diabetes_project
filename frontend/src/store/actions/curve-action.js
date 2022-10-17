import axios from "axios";
import jwt_decode from "jwt-decode";
import { curveActions } from "../slices/curve-slice";
import { uiActions } from "../slices/ui-slice";

const refreshToken = async () => {
  try {
    const { refreshToken } = JSON.parse(localStorage.getItem("user"));

    const response = await axios.post("http://localhost:4000/api/refresh", {
      token: refreshToken,
    });
    const { data } = response;

    const user = JSON.parse(localStorage.getItem("user"));

    user.accessToken = data.accessToken;
    user.refreshToken = data.refreshToken;

    localStorage.setItem("user", JSON.stringify(user));
    return data;
  } catch (error) {
    console.error(error);
  }
};

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const { accessToken } = JSON.parse(localStorage.getItem("user"));
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
    dispatch(uiActions.requestChart());
    const add = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));

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
      const message = await add();
      if (message) {
        dispatch(uiActions.successChart());
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const getCurve = (id) => {
  return async (dispatch) => {
    const get = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));

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
      const data = await get();

      if (data) {
        dispatch(curveActions.curveData({ data }));
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};
