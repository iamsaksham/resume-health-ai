"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "./ResumeHealthAI/styled.module.css";

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

export function SiteHeader({ hasStoredResult }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo} aria-label="Resume Health AI home">
          <Image
            src="/rhai-logo.png"
            alt="Resume Health AI"
            width={160}
            height={80}
            priority
            style={{ height: 80, width: "auto" }}
          />
        </Link>
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
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.attribution}>
      <p className={styles.attributionText}>
        Made with{" "}
        <span className={styles.heart} aria-label="love">
          ❤️
        </span>{" "}
        by iamsaksham
      </p>
    </footer>
  );
}
