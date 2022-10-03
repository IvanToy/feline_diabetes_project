import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loading: false,
    loadingChart: false,
    error: null,
  },
  reducers: {
    request(state) {
      state.loading = !state.loading;
    },
    requestChart(state) {
      state.loadingChart = !state.loadingChart;
    },
    success(state) {
      state.loading = !state.loading;
    },
    successChart(state) {
      state.loadingChart = !state.loadingChart;
    },
    failure(state, action) {
      state.loading = !state.loading;
      state.error = action.payload.error;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
