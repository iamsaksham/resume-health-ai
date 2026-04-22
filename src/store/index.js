import { configureStore } from "@reduxjs/toolkit";

import { resumeSlice } from "./resumeSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      resume: resumeSlice.reducer,
    },
  });
}
