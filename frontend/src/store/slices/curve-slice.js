import { createSlice } from "@reduxjs/toolkit";

const curveSlice = createSlice({
  name: "curve",
  initialState: {
    curveInfo: null,
  },

  reducers: {
    curveData(state, action) {
      const curve = {
        date: "",
        units: null,
        levels: [],
        id: null,
        curveLength: null,
      };

      const data = action.payload.data;

      if (data.data === null) {
        state.curveInfo = null;
      } else {
        curve.id = +data.id;
        curve.curveLength = data.curveLength;

        for (let key in data.curve) {
          if (key === "date")
            curve.date = new Date(data.curve[key]).toISOString().split("T")[0];
          if (key === "units")
            data.curve[key].amUnits
              ? (curve.units = data.curve[key].amUnits)
              : (curve.units = data.curve[key].pmUnits);

          if (key === "glucoseLevels") {
            for (let obj of data.curve[key]) {
              curve.levels.push(obj);
            }
          }
        }
        state.curveInfo = curve;
      }
    },
  },
});

export const curveActions = curveSlice.actions;

export default curveSlice;
