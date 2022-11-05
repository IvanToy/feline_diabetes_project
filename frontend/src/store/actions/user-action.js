import axios from "axios";
import jwt_decode from "jwt-decode";
import { userActions } from "../slices/user-slice";
import { petActions } from "../slices/pet-slice";
import { uiActions } from "../slices/ui-slice";

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

export const registerUser = (userInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));

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
      const userState = await register();

      dispatch(
        userActions.registerUser({
          accessToken: userState.accessToken,
          refreshToken: userState.refreshToken,
          isUserRegistered: userState.isUserRegistered,
          isPetsProfileCreated: userState.isPetsProfileCreated,
          hasChartData: userState.hasChartData,
        })
      );

      const userStateObj = {
        accessToken: userState.accessToken,
        refreshToken: userState.refreshToken,
        isUserRegistered: userState.isUserRegistered,
        isPetsProfileCreated: userState.isPetsProfileCreated,
        hasChartData: userState.hasChartData,
      };

      localStorage.setItem("userState", JSON.stringify(userStateObj));

      dispatch(uiActions.success({ loading: false, type: "general" }));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};

export const loginUser = (userInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));

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
      const userState = await login();
      dispatch(
        userActions.loginUser({
          accessToken: userState.accessToken,
          refreshToken: userState.refreshToken,
          isUserRegistered: userState.isUserRegistered,
          isPetsProfileCreated: userState.isPetsProfileCreated,
          hasChartData: userState.hasChartData,
        })
      );

      dispatch(
        petActions.createProfile({
          petsProfileExists: userState.isPetsProfileCreated,
        })
      );

      const userStateObj = {
        accessToken: userState.accessToken,
        refreshToken: userState.refreshToken,
        isUserRegistered: userState.isUserRegistered,
        isPetsProfileCreated: userState.isPetsProfileCreated,
        hasChartData: userState.hasChartData,
      };

      localStorage.setItem("userState", JSON.stringify(userStateObj));

      dispatch(uiActions.success({ loading: false, type: "general" }));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));

    const logout = async () => {
      const { accessToken } = JSON.parse(localStorage.getItem("userState"));
      const response = await axios.post(
        "http://localhost:4000/api/user/logout",
        { accessToken },
        { headers: { "Content-type": "application/json" } }
      );

      if (response.status === 200) {
        const { data } = response;
        return data;
      }
    };

    try {
      const userState = await logout();
      dispatch(
        userActions.logoutUser({
          accessToken: userState.accessToken,
          refreshToken: userState.refreshToken,
          isUserRegistered: userState.isUserRegistered,
          isPetsProfileCreated: userState.isPetsProfileCreated,
          hasChartData: userState.hasChartData,
        })
      );
      dispatch(
        petActions.deleteProfile({
          petsInfo: null,
        })
      );
      dispatch(uiActions.success({ loading: false, type: "general" }));

      localStorage.removeItem("userState");
    } catch (error) {
      dispatch(uiActions.generalFailure({ error: error.message }));
    }
  };
};

export const getUser = () => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));
    const get = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );
      const response = await axiosJWT.get("http://localhost:4000/api/user", {
        headers: { authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error("something went wrong");
      }

      const { data } = response;

      return data;
    };

    try {
      const userInfo = await get();
      dispatch(
        userActions.getUser({ name: userInfo.name, email: userInfo.email })
      );
      dispatch(uiActions.success({ loading: false, type: "general" }));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};

export const getUsersPassword = (password) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "password" }));
    const fetchPassword = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );
      const response = await axiosJWT.post(
        "http://localhost:4000/api/user/password",
        { password },
        {
          headers: {
            "Content-type": "Application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("something went wrong");
      }

      const { data } = response;

      return data;
    };

    try {
      const data = await fetchPassword();
      dispatch(userActions.getPassword({ password: data.password }));
      dispatch(uiActions.success({ loading: false, type: "password" }));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "password" }));
    }
  };
};

export const deletePassword = () => {
  return (dispatch) => {
    dispatch(userActions.deletePassword({ passwordDelete: true }));
  };
};

export const updateUser = (updatedUserInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));
    const update = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );
      const response = await axiosJWT.patch(
        "http://localhost:4000/api/user/update",
        updatedUserInfo,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Something went wrong, please try again.");
      }

      const { data } = response;
      return data;
    };

    try {
      const isUserInfoUpdated = await update();
      if (isUserInfoUpdated) {
        dispatch(userActions.updateUser({ updateProfile: true }));
        dispatch(uiActions.success({ loading: false, type: "general" }));
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};

export const updateUserProfile = () => {
  return (dispatch) => {
    dispatch(userActions.updateUser({ update: false }));
  };
};

export const deleteUser = () => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));
    const deleteUser = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );
      const response = await axiosJWT.delete(
        "http://localhost:4000/api/user/delete",
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Something went wrong, please try again.");
      }

      const { data } = response;
      return data;
    };

    try {
      const userState = await deleteUser();

      if (userState) {
        dispatch(
          userActions.deleteUser({
            userInfo: userState.userInfo,
            userData: {
              accessToken: userState.accessToken,
              refreshToken: userState.refreshToken,
              isUserRegistered: userState.isUserRegistered,
              isPetsProfileCreated: userState.isPetsProfileCreated,
              hasChartData: userState.hasChartData,
            },
          })
        );
        dispatch(uiActions.success({ loading: false, type: "general" }));
        localStorage.removeItem("userState");
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};
