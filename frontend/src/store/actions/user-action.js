import axios from "axios";
import jwt_decode from "jwt-decode";
import { userActions } from "../slices/user-slice";
import { petActions } from "../slices/pet-slice";
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
          isPetsProfileCreated: false,
        })
      );

      dispatch(uiActions.success());

      const user = {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        isRegistered: userData.isRegistered,
        isPetsProfileCreated: false,
      };

      localStorage.setItem("user", JSON.stringify(user));
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
          isPetsProfileCreated: userData.petsProfile,
        })
      );

      dispatch(petActions.createProfile({ isCreated: userData.petsProfile }));

      const user = {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        isRegistered: userData.isRegistered,
        isPetsProfileCreated: userData.petsProfile,
      };

      localStorage.setItem("user", JSON.stringify(user));

      dispatch(uiActions.success());
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(uiActions.request());

    const { accessToken } = JSON.parse(localStorage.getItem("user"));

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
            id: null,
            accessToken: null,
            refreshToken: null,
            isRegistered: false,
          })
        );
        dispatch(
          petActions.deleteProfile({
            petsInfo: null,
          })
        );
        dispatch(uiActions.success());
      }

      localStorage.removeItem("user");
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const getUser = () => {
  return async (dispatch) => {
    const get = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));

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
      const data = await get();
      dispatch(userActions.getUser({ name: data.name, email: data.email }));
    } catch (error) {}
  };
};

export const getUsersPassword = (password) => {
  return async (dispatch) => {
    const fetchPassword = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));

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
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const deletePassword = () => {
  return (dispatch) => {
    dispatch(userActions.deletePassword({ delete: true }));
  };
};

export const updateUser = (updatedUserInfo) => {
  return async (dispatch) => {
    const update = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));
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
      const message = await update();
      if (message) {
        dispatch(userActions.updateUser({ updated: true }));
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const updater = () => {
  return (dispatch) => {
    dispatch(userActions.updateUser({ update: false }));
  };
};

export const deleteUser = () => {
  return async (dispatch) => {
    const deleteUser = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));
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
      const message = await deleteUser();

      if (message) {
        dispatch(
          userActions.deleteUser({
            userInfo: null,
            userData: {
              accessToken: null,
              refreshToken: null,
              isRegistered: false,
              isPetsProfileCreated: false,
            },
          })
        );

        localStorage.removeItem("user");
      }
    } catch (error) {
      console.log(error);
    }
  };
};
