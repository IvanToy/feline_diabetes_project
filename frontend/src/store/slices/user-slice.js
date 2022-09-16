import { createSlice } from "@reduxjs/toolkit";

const accessToken = localStorage.getItem("accessToken")
  ? JSON.parse(localStorage.getItem("accessToken"))
  : null;
const refreshToken = localStorage.getItem("refreshToken")
  ? JSON.parse(localStorage.getItem("refreshToken"))
  : null;
const isRegistered = localStorage.getItem("isRegistered")
  ? JSON.parse(localStorage.getItem("isRegistered"))
  : false;

const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken,
    refreshToken,
    isRegistered,
    userInfo: [],
  },

  reducers: {
    registerUser(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isRegistered = action.payload.isRegistered;
    },
    loginUser(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isRegistered = action.payload.isRegistered;
    },

    logoutUser(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isRegistered = action.payload.isRegistered;
    },
    updateUser(state, action) {},
    deleteUser(state, action) {},
  },
});

export const userActions = userSlice.actions;

export default userSlice;
