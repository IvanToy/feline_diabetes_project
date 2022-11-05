import { createSlice } from "@reduxjs/toolkit";

let accessToken = null;
let refreshToken = null;
let isUserRegistered = false;
let isPetsProfileCreated = false;
let hasChartData = false;

const userState = JSON.parse(localStorage.getItem("userState"));

if (userState) {
  accessToken = userState.accessToken;
  refreshToken = userState.refreshToken;
  isUserRegistered = userState.isUserRegistered;
  isPetsProfileCreated = userState.isPetsProfileCreated;
  hasChartData = userState.hasChartData;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    userState: {
      accessToken,
      refreshToken,
      isUserRegistered,
      isPetsProfileCreated,
      hasChartData,
    },
    userInfo: null,
    updateProfile: false,
  },

  reducers: {
    registerUser(state, action) {
      state.userState.accessToken = action.payload.accessToken;
      state.userState.refreshToken = action.payload.refreshToken;
      state.userState.isUserRegistered = action.payload.isUserRegistered;
      state.userState.isPetsProfileCreated =
        action.payload.isPetsProfileCreated;

      state.userState.hasChartData = action.payload.hasCharData;
    },
    loginUser(state, action) {
      state.userState.accessToken = action.payload.accessToken;
      state.userState.refreshToken = action.payload.refreshToken;
      state.userState.isUserRegistered = action.payload.isUserRegistered;
      state.userState.hasChartData = action.payload.hasChartData;
    },

    logoutUser(state, action) {
      state.userState.accessToken = action.payload.accessToken;
      state.userState.refreshToken = action.payload.refreshToken;
      state.userState.isUserRegistered = action.payload.isUserRegistered;
      state.userState.hasChartData = action.payload.hasChartData;
    },
    getUser(state, action) {
      const user = {
        name: "",
        email: "",
      };

      user.name = action.payload.name;
      user.email = action.payload.email;

      state.userInfo = user;
    },
    getPassword(state, action) {
      state.userInfo["password"] = action.payload.password;
    },
    deletePassword(state, action) {
      const passwordDelete = action.payload.passwordDelete;

      if (passwordDelete) {
        delete state.userInfo.passwordDelete;
      }
    },
    updateUser(state, action) {
      state.updateProfile = action.payload.updateProfile;
    },
    deleteUser(state, action) {
      state.userInfo = action.payload.userInfo;
      state.userState.accessToken = action.payload.userData.accessToken;
      state.userState.refreshToken = action.payload.userData.refreshToken;
      state.userState.isUserRegistered = action.payload.userData.isRegistered;
      state.userState.isPetsProfileCreated =
        action.payload.userData.isPetsProfileCreated;
      state.userState.hasChartData = action.payload.hasCharData;
    },
    setChartData(state, action) {
      state.userState.hasChartData = action.payload.hasChartData;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
