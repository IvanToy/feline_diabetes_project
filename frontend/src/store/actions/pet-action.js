import axios from "axios";
import jwt_decode from "jwt-decode";
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

export const createPetsProfile = (petsInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));

    const createProfile = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );

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
        data: { isPetsProfileCreated },
      } = response;

      return isPetsProfileCreated;
    };

    try {
      const isPetsProfileCreated = await createProfile();

      if (isPetsProfileCreated) {
        dispatch(
          petActions.createProfile({
            petsProfileExists: isPetsProfileCreated,
          })
        );
      }

      dispatch(uiActions.success({ loading: false, type: "general" }));

      const userState = JSON.parse(localStorage.getItem("userState"));

      userState.isPetsProfileCreated = isPetsProfileCreated;

      localStorage.setItem("userState", JSON.stringify(userState));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};

export const getPetsProfile = (path) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));
    const getProfile = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );

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
      dispatch(uiActions.success({ loading: false, type: "general" }));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};

export const updatePet = () => {
  return (dispatch) => {
    dispatch(petActions.updatePetsProfile({ updatePetsProfile: true }));
    localStorage.setItem("updatePetsProfile", JSON.stringify(true));
  };
};

export const updatedPetsProfile = (updatedInfo) => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));

    const updateProfile = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );
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
      const isProfileUpdated = await updateProfile();

      if (isProfileUpdated) {
        dispatch(uiActions.success({ loading: false, type: "general" }));
        dispatch(petActions.updatePetsProfile({ updatePetsProfile: false }));
        localStorage.removeItem("updatePetsProfile");
      }
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};

export const deletePetsProfile = () => {
  return async (dispatch) => {
    dispatch(uiActions.request({ loading: true, type: "general" }));

    const deleteProfile = async () => {
      const { accessToken: token } = JSON.parse(
        localStorage.getItem("userState")
      );

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
      const petsInfo = await deleteProfile();

      if (petsInfo) {
        dispatch(uiActions.success({ loading: false, type: "general" }));
        dispatch(
          petActions.deleteProfile({
            petsInfo: petsInfo.petsInfo,
            petsProfileExits: petsInfo.isPetsProfileCreated,
          })
        );
      }
      const userState = JSON.parse(localStorage.getItem("userState"));
      userState.isPetsProfileCreated = false;
      localStorage.setItem("userState", JSON.stringify(userState));
    } catch (error) {
      dispatch(uiActions.failure({ error: error.message, type: "general" }));
    }
  };
};
