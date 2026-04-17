"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pickHint, setPickHint] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile || !isPdfFile(selectedFile)) {
      setPdfPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(selectedFile);
    setPdfPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setPickHint(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

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

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

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
      const file = e.dataTransfer.files?.[0];
      if (file) assignFile(file);
    },
    [assignFile],
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
            className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""}`}
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
                    {pdfPreviewUrl ? (
                      <iframe
                        src={`${pdfPreviewUrl}#toolbar=0&navpanes=0`}
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
                      <button type="button" className={styles.filePreviewRemove} onClick={clearSelectedFile}>
                        Remove
                      </button>
                      <button type="button" className={styles.filePreviewChange} onClick={openFilePicker}>
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
          <button type="button" className={styles.uploadCta}>
            Upload resume
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
