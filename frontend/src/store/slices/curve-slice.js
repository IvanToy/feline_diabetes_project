import { createSlice } from "@reduxjs/toolkit";

const curveSlice = createSlice({
  name: "curve",
  initialState: {
    curveInfo: null,
  },

  reducers: {
    getCurve(state, action) {
      const curve = {
        date: "",
        units: null,
        levels: [],
        id: null,
        curveLength: null,
      };

      const chartData = action.payload.chartData;

      curve.id = +chartData.id;
      curve.curveLength = chartData.curveLength;

      for (let key in chartData.curve) {
        if (key === "date")
          curve.date = new Date(chartData.curve[key])
            .toISOString()
            .split("T")[0];
        if (key === "units")
          chartData.curve[key].amUnits
            ? (curve.units = chartData.curve[key].amUnits)
            : (curve.units = chartData.curve[key].pmUnits);

        if (key === "glucoseLevels") {
          for (let obj of chartData.curve[key]) {
            curve.levels.push(obj);
          }
        }
      }
      state.curveInfo = curve;
    },
    cleanCurve(state, action) {
      state.curveInfo = action.payload.curveInfo;
    },
  },
});

export const curveActions = curveSlice.actions;

export default curveSlice;
