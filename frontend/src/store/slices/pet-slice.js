import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));
let isCreated;
if (user?.isPetsProfileCreated) {
  isCreated = user.isPetsProfileCreated;
} else {
  isCreated = false;
}

const toUpdate = localStorage.getItem("toUpdate")
  ? JSON.parse(localStorage.getItem("toUpdate"))
  : false;

const petSlice = createSlice({
  name: "pet",
  initialState: {
    petsInfo: null,
    isCreated,
    toUpdate,
  },

  reducers: {
    createProfile(state, action) {
      state.isCreated = action.payload.isCreated;
    },

    getProfile(state, action) {
      state.petsInfo = {
        name: action.payload.name,
        sex: action.payload.sex,
        age: action.payload.age,
        breed: action.payload.breed,
        diagnosed: action.payload.diagnosed,
        dosingMethod: action.payload.dosingMethod,
        dosingDate: action.payload.dosingDate,
        currentInsulin: action.payload.currentInsulin,
        meter: action.payload.meter,
      };
    },

    update(state, action) {
      state.toUpdate = action.payload.message;
    },

    deleteProfile(state, action) {
      state.petsInfo = action.payload.petsInfo;
      state.isCreated = action.payload.isCreated;
    },
  },
});

export const petActions = petSlice.actions;

export default petSlice;
