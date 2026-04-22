import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resumeRawText: "",
  resumeParsedData: null,
  resumePreviewUrl: null,
  resumePreviewFileName: null,
  resumePreviewIsPdf: false,
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
    setResumePreview(state, action) {
      const p = action.payload ?? {};
      state.resumePreviewUrl =
        typeof p.url === "string" && p.url.length > 0 ? p.url : null;
      state.resumePreviewFileName =
        typeof p.fileName === "string" ? p.fileName : null;
      state.resumePreviewIsPdf = Boolean(p.isPdf);
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
  setResumePreview,
  setResumeResult,
  clearResumeResult,
} = resumeSlice.actions;

export const selectResumeRawText = (state) => state.resume.resumeRawText;
export const selectResumeParsedData = (state) => state.resume.resumeParsedData;
export const selectResumePreviewUrl = (state) => state.resume.resumePreviewUrl;
export const selectResumePreviewFileName = (state) =>
  state.resume.resumePreviewFileName;
export const selectResumePreviewIsPdf = (state) =>
  state.resume.resumePreviewIsPdf;
