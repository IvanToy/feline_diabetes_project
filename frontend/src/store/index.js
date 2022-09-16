import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/user-slice";
import petSlice from "./slices/pet-slice";
import uiSlice from "./slices/ui-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    ui: uiSlice.reducer,
    pet: petSlice.reducer,
  },
});

export default store;
