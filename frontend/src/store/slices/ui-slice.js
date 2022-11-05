import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    generalUI: {
      loading: false,
      error: null,
    },
    chartUI: {
      loading: false,
      error: null,
    },
    passwordUI: {
      loading: false,
      error: null,
    },
  },
  reducers: {
    request(state, action) {
      if (action.payload.type === "general") {
        state.generalUI.loading = action.payload.loading;
      }

      if (action.payload.type === "chart") {
        state.chartUI.loading = action.payload.loading;
      }

      if (action.payload.type === "password") {
        state.passwordUI.loading = action.payload.loading;
      }
    },

    success(state, action) {
      if (action.payload.type === "general") {
        state.generalUI.loading = action.payload.loading;
      }

      if (action.payload.type === "chart") {
        state.chartUI.loading = action.payload.loading;
      }

      if (action.payload.type === "password") {
        state.passwordUI.loading = action.payload.loading;
      }
    },

    failure(state, action) {
      if (action.payload.type === "general") {
        state.generalUI.loading = action.payload.loading;
        state.generalUI.error = action.payload.error;
      }

      if (action.type === "chart") {
        state.chartUI.loading = action.payload.loading;
        state.chartUI.error = action.payload.error;
      }

      if (action.type === "password") {
        state.passwordUI.loading = action.payload.loading;
        state.passwordUI.error = action.payload.error;
      }
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
