import axios from "axios";
import jwt_decode from "jwt-decode";
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

export const createPetsProfile = (petsInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request());

    const createProfile = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));

      const response = await axiosJWT.post(
        "http://localhost:4000/api/pet/createProfile",
        petsInfo,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Something went wrong, please try again");
      }

      const {
        data: { isCreated },
      } = response;

      return isCreated;
    };

    try {
      const isCreated = await createProfile();

      if (isCreated) {
        dispatch(
          petActions.createProfile({
            isCreated,
          })
        );
      }

      dispatch(uiActions.success());

      const user = JSON.parse(localStorage.getItem("user"));

      user.isPetsProfileCreated = isCreated;

      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const getPetsProfile = (path) => {
  return async (dispatch) => {
    dispatch(uiActions.request());
    const getProfile = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));

      const response = await axiosJWT.get(
        `http://localhost:4000/api/pet/${path}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }

      const { data } = response;
      return data;
    };

    try {
      const petsInfo = await getProfile();

      dispatch(
        petActions.getProfile({
          id: petsInfo.id,
          name: petsInfo.name,
          age: petsInfo.age,
          sex: petsInfo.sex,
          breed: petsInfo.breed,
          diagnosed: petsInfo.diagnosed,
          dosingMethod: petsInfo.dosingMethod,
          dosingDate: petsInfo.dosingDate,
          currentInsulin: petsInfo.currentInsulin,
          meter: petsInfo.meter,
        })
      );
      dispatch(uiActions.success());
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const toUpdate = () => {
  return (dispatch) => {
    dispatch(petActions.update({ message: true }));
    localStorage.setItem("toUpdate", JSON.stringify(true));
  };
};

export const updatedPetsProfile = (updatedInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request());

    const updateProfile = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));
      const response = await axiosJWT.patch(
        "http://localhost:4000/api/pet/updateProfile",
        updatedInfo,
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
      const message = await updateProfile();

      if (message) {
        dispatch(uiActions.success());
        dispatch(petActions.update({ message: false }));
        localStorage.removeItem("toUpdate");
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message }));
    }
  };
};

export const deletePetsProfile = () => {
  return async (dispatch) => {
    dispatch(uiActions.request());

    const deleteProfile = async () => {
      const { accessToken: token } = JSON.parse(localStorage.getItem("user"));

      const response = await axiosJWT.delete(
        "http://localhost:4000/api/pet/deleteProfile",
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
      const message = await deleteProfile();

      if (message) {
        dispatch(uiActions.success());
        dispatch(
          petActions.deleteProfile({
            petsInfo: null,
            isCreated: false,
          })
        );
      }
    } catch (error) {
      dispatch(uiActions.failure({ message: error.message }));
    }
  };
};
