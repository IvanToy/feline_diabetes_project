import { createSlice } from "@reduxjs/toolkit";

let petsProfileExists = false;

const userState = JSON.parse(localStorage.getItem("userState"));

const updatePetsProfile = localStorage.getItem("updatePetsProfile")
  ? JSON.parse(localStorage.getItem("updatePetsProfile"))
  : false;

if (userState) {
  petsProfileExists = userState.isPetsProfileCreated;
}

const petSlice = createSlice({
  name: "pet",
  initialState: {
    petsInfo: null,
    petsProfileExists,
    updatePetsProfile,
  },

  reducers: {
    createProfile(state, action) {
      state.petsProfileExists = action.payload.petsProfileExists;
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

    updatePetsProfile(state, action) {
      state.updatePetsProfile = action.payload.updatePetsProfile;
    },

    deleteProfile(state, action) {
      state.petsInfo = action.payload.petsInfo;
      state.petsProfileExists = action.payload.petsProfileExists;
    },
  },
});

export const petActions = petSlice.actions;

export default petSlice;
