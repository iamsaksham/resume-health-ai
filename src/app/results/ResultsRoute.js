"use client";

import Link from "next/link";
import { useSelector } from "react-redux";

import ResumeHealthResultView from "@/app/components/ResumeHealthResultView";
import {
  selectResumeParsedData,
  selectResumePreviewIsPdf,
  selectResumePreviewUrl,
  selectResumeRawText,
} from "@/store/resumeSlice";

import styles from "./results.module.css";

export default function ResultsRoute() {
  const resumeRawText = useSelector(selectResumeRawText);
  const resumeParsedData = useSelector(selectResumeParsedData);
  const previewUrl = useSelector(selectResumePreviewUrl);
  const previewIsPdf = useSelector(selectResumePreviewIsPdf);

  const hasRaw = Boolean(resumeRawText?.trim());
  const hasParsed =
    resumeParsedData != null && typeof resumeParsedData === "object";
  const showPdfPreview = Boolean(previewIsPdf && previewUrl);
  const hasData = hasRaw || hasParsed || showPdfPreview;

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          <span className={styles.backChevron} aria-hidden>
            ←
          </span>
          Upload
        </Link>
        <span className={styles.topTitle}>Analysis</span>
        <span className={styles.topSpacer} aria-hidden />
      </header>

      <main className={styles.main}>
        {!hasData ? (
          <div className={styles.emptyCard}>
            <p className={styles.emptyTitle}>No signal yet</p>
            <p className={styles.emptyCopy}>
              Run an upload from the home console to stream raw text and structured
              data here.
            </p>
            <Link href="/" className={styles.emptyCta}>
              Open upload
            </Link>
          </div>
        ) : (
          <ResumeHealthResultView />
        )}
      </main>
    </div>
  );
}
