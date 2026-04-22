"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import {
  clearResumeResult,
  selectResumeParsedData,
  selectResumePreviewIsPdf,
  selectResumePreviewUrl,
  selectResumeRawText,
  setResumeParsedData,
  setResumePreview,
  setResumeRawText,
} from "@/store/resumeSlice";
import { withPdfViewerParams } from "@/utils/pdfPreviewParams";
import styles from "./styled.module.css";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const RESUME_FILE_INPUT_ID = "resume-file-input";

function isAllowedResumeFile(file) {
  const lower = file.name.toLowerCase();
  if (!/\.(pdf|doc|docx)$/.test(lower)) return false;
  if (file.size > MAX_FILE_BYTES) return false;
  return true;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdfFile(file) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function DocPreviewIcon() {
  return (
    <svg className={styles.filePreviewDocSvg} viewBox="0 0 48 56" aria-hidden="true">
      <path
        fill="currentColor"
        fillOpacity="0.12"
        d="M8 4h22l12 12v40H8V4z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        d="M8 4h22l12 12v40H8V4z M30 4v12h10"
      />
      <path
        fill="currentColor"
        fillOpacity="0.45"
        d="M14 32h20v2H14v-2zm0-6h20v2H14v-2zm0-6h14v2H14v-2z"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ResumeHealthAI() {
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();
  const resumeRawText = useSelector(selectResumeRawText);
  const resumeParsedData = useSelector(selectResumeParsedData);
  const pdfPreviewUrl = useSelector(selectResumePreviewUrl);
  const pdfPreviewIsPdf = useSelector(selectResumePreviewIsPdf);
  const hasStoredResult =
    Boolean(resumeRawText?.trim()) ||
    (resumeParsedData != null && typeof resumeParsedData === "object") ||
    Boolean(pdfPreviewIsPdf && pdfPreviewUrl);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pickHint, setPickHint] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const fileInputRef = useRef(null);
  const uploadTaskInProgressRef = useRef(false);

  useEffect(() => {
    if (!selectedFile) {
      return undefined;
    }
    if (!isPdfFile(selectedFile)) {
      const prevUrl = store.getState().resume.resumePreviewUrl;
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      dispatch(
        setResumePreview({
          url: null,
          fileName: selectedFile.name,
          isPdf: false,
        }),
      );
      return undefined;
    }
    const prevUrl = store.getState().resume.resumePreviewUrl;
    if (prevUrl) {
      URL.revokeObjectURL(prevUrl);
    }
    const url = URL.createObjectURL(selectedFile);
    dispatch(
      setResumePreview({
        url,
        fileName: selectedFile.name,
        isPdf: true,
      }),
    );
    return undefined;
  }, [selectedFile, dispatch, store]);

  useEffect(() => {
    if (uploadInProgress) setDragActive(false);
  }, [uploadInProgress]);

  const handlePdfToTextAPI = useCallback(async () => {
    if (!selectedFile || uploadTaskInProgressRef.current) return;
    uploadTaskInProgressRef.current = true;
    setUploadInProgress(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("/api/parsePdfToText", {
        method: "POST",
        body: formData,
      });
      const resData = await response.json();
      return resData.response;
    } catch (error) {
      console.error('--> ', error);
    } finally {
      uploadTaskInProgressRef.current = false;
      setUploadInProgress(false);
    }
  }, [selectedFile]);

  const handleTextToJsonAI = useCallback(async (pdfText) => {
    if (!pdfText || uploadTaskInProgressRef.current) return;
    uploadTaskInProgressRef.current = true;
    setUploadInProgress(true);
    try {
      const response = await fetch("/api/convertTextToJsonAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfText }),
      });
      const resData = await response.json();
      return resData.response;
    } catch (error) {
      console.error('--> ', error);
    } finally {
      uploadTaskInProgressRef.current = false;
      setUploadInProgress(false);
    }
  }, [selectedFile]);

  const handleUploadResume = useCallback(async () => {
    const pdfText = await handlePdfToTextAPI();
    dispatch(setResumeRawText(typeof pdfText === "string" ? pdfText : ""));
    const pdfJson = await handleTextToJsonAI(pdfText);
    dispatch(setResumeParsedData(pdfJson ?? null));
    router.push("/results");
  }, [dispatch, handlePdfToTextAPI, handleTextToJsonAI, router]);

  const clearSelectedFile = useCallback(() => {
    const prevUrl = store.getState().resume.resumePreviewUrl;
    if (prevUrl) {
      URL.revokeObjectURL(prevUrl);
    }
    setSelectedFile(null);
    setPickHint(null);
    dispatch(clearResumeResult());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [dispatch, store]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const assignFile = useCallback((file) => {
    if (!file) return;
    if (!isAllowedResumeFile(file)) {
      setPickHint(
        file.size > MAX_FILE_BYTES
          ? "That file is over 10 MB. Choose a smaller export."
          : "Use a PDF, DOC, or DOCX file.",
      );
      return;
    }
    setPickHint(null);
    setSelectedFile(file);
  }, []);

  const onFileInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) assignFile(file);
    },
    [assignFile],
  );

  const onDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      if (uploadInProgress) return;
      setDragActive(true);
    },
    [uploadInProgress],
  );

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    const next = e.relatedTarget;
    if (!next || !e.currentTarget.contains(next)) {
      setDragActive(false);
    }
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      if (uploadInProgress) return;
      const file = e.dataTransfer.files?.[0];
      if (file) assignFile(file);
    },
    [assignFile, uploadInProgress],
  );

  const onDropzoneClick = useCallback(
    (e) => {
      if (uploadInProgress) return;
      if (e.target.closest("button")) return;
      if (e.target.closest("label")) return;
      if (e.target.closest("iframe")) return;
      openFilePicker();
    },
    [openFilePicker, uploadInProgress],
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <Image
              src="/rhai-logo.png"
              alt="Resume Health AI"
              width={160}
              height={80}
              priority
              style={{ height: 80, width: "auto" }}
            />
          </div>
          <div className={styles.titleBlock}>
            <h1 className={styles.mainHeading}>Resume Health AI</h1>
            <p className={styles.subHeading}>
              🤖 Validated by AI. ✨ Structured with precision
            </p>
          </div>
          <div className={styles.profileWrap}>
            {hasStoredResult ? (
              <Link href="/results" className={styles.resultsLink}>
                Analysis
              </Link>
            ) : null}
            <details className={styles.profileMenu}>
              <summary className={styles.profileSummary} aria-label="Account menu">
                <ProfileIcon />
              </summary>
              <div className={styles.profilePanel} role="menu">
                <button type="button" className={styles.profileItem} role="menuitem">
                  Profile
                </button>
                <button type="button" className={styles.profileItem} role="menuitem">
                  Logout
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.bodyContent}>
          <div
            className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""} ${uploadInProgress ? styles.dropzoneBusy : ""}`}
            onClick={onDropzoneClick}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input
              id={RESUME_FILE_INPUT_ID}
              ref={fileInputRef}
              type="file"
              className={styles.srOnly}
              accept=".pdf,.doc,.docx"
              onChange={onFileInputChange}
            />
            {selectedFile ? (
              <>
                <div className={styles.filePreview}>
                  <div className={styles.filePreviewThumb}>
                    {pdfPreviewIsPdf && pdfPreviewUrl ? (
                      <iframe
                        src={withPdfViewerParams(pdfPreviewUrl)}
                        className={styles.filePreviewIframe}
                        title={`Preview of ${selectedFile.name}`}
                      />
                    ) : (
                      <div className={styles.filePreviewDocWrap}>
                        <DocPreviewIcon />
                      </div>
                    )}
                  </div>
                  <div className={styles.filePreviewMeta}>
                    <p className={styles.filePreviewName}>{selectedFile.name}</p>
                    <p className={styles.filePreviewSize}>{formatFileSize(selectedFile.size)}</p>
                    <div className={styles.filePreviewActions}>
                      <button
                        type="button"
                        className={styles.filePreviewRemove}
                        onClick={clearSelectedFile}
                        disabled={uploadInProgress}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        className={styles.filePreviewChange}
                        onClick={openFilePicker}
                        disabled={uploadInProgress}
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                </div>
                {pickHint ? <p className={styles.pickHint}>{pickHint}</p> : null}
                <p className={styles.dropzoneHint}>PDF, DOC, or DOCX · max 10 MB</p>
              </>
            ) : (
              <>
                <p className={styles.dropzoneText}>Drag and drop your resume here</p>
                <p className={styles.dropzoneHint}>PDF, DOC, or DOCX · max 10 MB</p>
                {pickHint ? <p className={styles.pickHint}>{pickHint}</p> : null}
                <span className={styles.or}>or</span>
                <label className={styles.browseLabel} htmlFor={RESUME_FILE_INPUT_ID}>
                  Browse files
                </label>
              </>
            )}
          </div>
          <button
            type="button"
            className={`${styles.uploadCta} ${uploadInProgress ? styles.uploadCtaLoading : ""}`}
            onClick={handleUploadResume}
            disabled={!selectedFile || uploadInProgress}
            aria-busy={uploadInProgress}
          >
            {uploadInProgress ? (
              <>
                <span className={styles.uploadCtaSpinner} aria-hidden />
                <span>Analyzing resume…</span>
              </>
            ) : (
              "Upload resume"
            )}
          </button>
        </div>
      </main>

      <footer className={styles.attribution}>
        <p className={styles.attributionText}>
          Made with{" "}
          <span className={styles.heart} aria-label="love">
            ❤️
          </span>{" "}
          by iamsaksham
        </p>
      </footer>
    </div>
  );
}
