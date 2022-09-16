import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    request(state) {
      state.loading = !state.loading;
    },
    success(state) {
      state.loading = !state.loading;
    },
    failure(state, action) {
      state.loading = !state.loading;
      state.error = action.payload.error;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
