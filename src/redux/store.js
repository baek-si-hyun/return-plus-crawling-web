import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./historySlice";

const store = configureStore({
  reducer: {
    history: historyReducer,
  },
});

export default store;