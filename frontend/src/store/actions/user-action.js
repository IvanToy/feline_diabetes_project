import axios from "axios";
import jwt_decode from "jwt-decode";
import { userActions } from "../slices/user-slice";
import { uiActions } from "../slices/ui-slice";

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(
      "http://localhost:4000/api/refresh",
      refreshToken
    );
    const { data } = response;
    localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
    localStorage.setItem("refreshToke", JSON.stringify(data.refreshToken));
    return data;
  } catch (error) {
    console.error(error);
  }
};

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
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

export const registerUser = (userInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request());

    const register = async () => {
      const response = await axios.post(
        "http://localhost:4000/api/user/register",
        userInfo,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status !== 200) {
        throw new Error("Failed to register. Please try again.");
      }

      const { data } = response;
      return data;
    };

    try {
      const userData = await register();
      dispatch(
        userActions.registerUser({
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          isRegistered: userData.isRegistered,
        })
      );

      dispatch(uiActions.success());

      localStorage.setItem("accessToken", JSON.stringify(userData.accessToken));

      localStorage.setItem(
        "refreshToken",
        JSON.stringify(userData.refreshToken)
      );

      localStorage.setItem(
        "isRegistered",
        JSON.stringify(userData.isRegistered)
      );
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const loginUser = (userInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request());

    const login = async () => {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        userInfo,
        { headers: { "Content-type": "application/json" } }
      );

      if (response.status !== 200) {
        throw new Error("Failed to log in. Please try again.");
      }

      const { data } = response;

      return data;
    };

    try {
      const userData = await login();
      dispatch(
        userActions.loginUser({
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          isRegistered: userData.isRegistered,
        })
      );

      dispatch(uiActions.success());

      localStorage.setItem("accessToken", JSON.stringify(userData.accessToken));

      localStorage.setItem(
        "refreshToken",
        JSON.stringify(userData.refreshToken)
      );

      localStorage.setItem(
        "isRegistered",
        JSON.stringify(userData.isRegistered)
      );
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(uiActions.request());

    const accessToken = JSON.parse(localStorage.getItem("accessToken"));

    const logout = async () => {
      const response = await axios.post(
        "http://localhost:4000/api/user/logout",
        { accessToken },
        { headers: { "Content-type": "application/json" } }
      );

      if (response.status === 200 && response.data.message.includes("out")) {
        const { data } = response;
        return data;
      }
    };

    try {
      const data = await logout();
      if (data.message.includes("out")) {
        dispatch(
          userActions.logoutUser({
            accessToken: null,
            refreshToken: null,
            isRegistered: false,
          })
        );
        dispatch(uiActions.success());
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const updateUser = () => {};

export const deleteUser = () => {};
