"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

import BasicInfoFields from "@/app/components/ui/resume-result/BasicInfoFields";
import DownloadJsonButton from "@/app/components/ui/resume-result/DownloadJsonButton";
import EducationList from "@/app/components/ui/resume-result/EducationList";
import ExperienceList from "@/app/components/ui/resume-result/ExperienceList";
import SectionCard from "@/app/components/ui/resume-result/SectionCard";
import SkillTags from "@/app/components/ui/resume-result/SkillTags";
import {
  selectResumeParsedData,
  selectResumeRawText,
} from "@/store/resumeSlice";

import styles from "./ResumeHealthResultView.module.css";

function normalizeParsed(data) {
  if (!data || typeof data !== "object") return null;
  return data;
}

export function ResumeHealthResultView() {
  const resumeRawText = useSelector(selectResumeRawText);
  const resumeParsedData = useSelector(selectResumeParsedData);

  const parsed = useMemo(
    () => normalizeParsed(resumeParsedData),
    [resumeParsedData],
  );

  const hasRaw = Boolean(resumeRawText?.trim());
  const hasParsed = parsed != null;
  const visible = hasRaw || hasParsed;

  if (!visible) {
    return null;
  }

  const basic = {
    name: parsed?.name ?? "",
    email: parsed?.email ?? "",
    phone: parsed?.phone ?? "",
  };

  return (
    <div className={styles.root}>
      <div className={styles.shell}>
        <div className={`${styles.column} ${styles.panel}`}>
          <header className={styles.stickyHeader}>
            <div className={styles.stickyHeaderLeft}>
              <h2 className={styles.panelTitle}>Raw Resume</h2>
            </div>
          </header>
          <div className={`${styles.scrollRegion} ${styles.scrollRegionTight}`}>
            {hasRaw ? (
              <textarea
                className={styles.rawTextarea}
                readOnly
                value={resumeRawText}
                aria-label="Raw resume text"
                spellCheck={false}
              />
            ) : (
              <p className={styles.rawPlaceholder}>No raw text available.</p>
            )}
          </div>
        </div>

        <div className={`${styles.column} ${styles.panel}`}>
          <header className={styles.stickyHeader}>
            <div className={styles.stickyHeaderLeft}>
              <h2 className={styles.panelTitle}>Structured Data</h2>
            </div>
            <DownloadJsonButton data={parsed} disabled={!hasParsed} />
          </header>
          <div className={styles.scrollRegion}>
            <div className={styles.structuredStack}>
              <SectionCard title="Basic Info">
                {hasParsed ? (
                  <BasicInfoFields
                    name={basic.name}
                    email={basic.email}
                    phone={basic.phone}
                  />
                ) : (
                  <p className={styles.rawPlaceholder}>
                    Structured data not available yet.
                  </p>
                )}
              </SectionCard>

              <SectionCard title="Skills">
                <SkillTags skills={hasParsed ? parsed.skills : []} />
              </SectionCard>

              <SectionCard title="Experience">
                <ExperienceList
                  experience={hasParsed ? parsed.experience : []}
                />
              </SectionCard>

              <SectionCard title="Education">
                <EducationList
                  education={hasParsed ? parsed.education : []}
                />
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeHealthResultView;
