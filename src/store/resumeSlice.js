import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resumeRawText: "",
  resumeParsedData: null,
};

export const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResumeRawText(state, action) {
      state.resumeRawText =
        typeof action.payload === "string" ? action.payload : "";
    },
    setResumeParsedData(state, action) {
      state.resumeParsedData = action.payload ?? null;
    },
    setResumeResult(state, action) {
      const { resumeRawText, resumeParsedData } = action.payload ?? {};
      if (resumeRawText !== undefined) {
        state.resumeRawText =
          typeof resumeRawText === "string" ? resumeRawText : "";
      }
      if (resumeParsedData !== undefined) {
        state.resumeParsedData = resumeParsedData ?? null;
      }
    },
    clearResumeResult() {
      return { ...initialState };
    },
  },
});

export const {
  setResumeRawText,
  setResumeParsedData,
  setResumeResult,
  clearResumeResult,
} = resumeSlice.actions;

export const selectResumeRawText = (state) => state.resume.resumeRawText;
export const selectResumeParsedData = (state) => state.resume.resumeParsedData;
