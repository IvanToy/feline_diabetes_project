import { createSlice } from "@reduxjs/toolkit";

const isUser = localStorage.getItem("user") ? true : false;

let accessToken, refreshToken, isRegistered, isPetsProfileCreated;

if (isUser) {
  const {
    accessToken: tokenA,
    refreshToken: tokenR,
    isRegistered: registered,
    isPetsProfileCreated: isCreated,
  } = JSON.parse(localStorage.getItem("user"));
  accessToken = tokenA;
  refreshToken = tokenR;
  isRegistered = registered;
  isPetsProfileCreated = isCreated;
} else {
  accessToken = null;
  refreshToken = null;
  isRegistered = false;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {
      accessToken,
      refreshToken,
      isRegistered,
      isPetsProfileCreated,
    },
    userInfo: null,
    updated: false,
  },

  reducers: {
    registerUser(state, action) {
      state.userData.accessToken = action.payload.accessToken;
      state.userData.refreshToken = action.payload.refreshToken;
      state.userData.isRegistered = action.payload.isRegistered;
      state.userData.isPetsProfileCreated = action.payload.isPetsProfileCreated;
    },
    loginUser(state, action) {
      state.userData.accessToken = action.payload.accessToken;
      state.userData.refreshToken = action.payload.refreshToken;
      state.userData.isRegistered = action.payload.isRegistered;
    },

    logoutUser(state, action) {
      state.userData.accessToken = action.payload.accessToken;
      state.userData.refreshToken = action.payload.refreshToken;
      state.userData.isRegistered = action.payload.isRegistered;
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
      const toDelete = action.payload.delete;

      if (toDelete) {
        delete state.userInfo.password;
      }
    },
    updateUser(state, action) {
      state.updated = action.payload.updated;
    },
    deleteUser(state, action) {
      state.userInfo = action.payload.userInfo;
      state.userData.accessToken = action.payload.userData.accessToken;
      state.userData.refreshToken = action.payload.userData.refreshToken;
      state.userData.isRegistered = action.payload.userData.isRegistered;
      state.userData.isPetsProfileCreated =
        action.payload.userData.isPetsProfileCreated;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
