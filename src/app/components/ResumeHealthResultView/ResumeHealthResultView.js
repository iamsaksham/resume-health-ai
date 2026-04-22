"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

import BasicInfoFields from "@/app/components/ui/resume-result/BasicInfoFields";
import DownloadJsonButton from "@/app/components/ui/resume-result/DownloadJsonButton";
import EducationList from "@/app/components/ui/resume-result/EducationList";
import ExperienceList from "@/app/components/ui/resume-result/ExperienceList";
import SectionCard from "@/app/components/ui/resume-result/SectionCard";
import SkillCategoryLegend from "@/app/components/ui/resume-result/SkillCategoryLegend";
import SkillTags from "@/app/components/ui/resume-result/SkillTags";
import { withPdfViewerParams } from "@/utils/pdfPreviewParams";
import {
  selectResumeParsedData,
  selectResumePreviewFileName,
  selectResumePreviewIsPdf,
  selectResumePreviewUrl,
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
  const previewUrl = useSelector(selectResumePreviewUrl);
  const previewFileName = useSelector(selectResumePreviewFileName);
  const previewIsPdf = useSelector(selectResumePreviewIsPdf);

  const parsed = useMemo(
    () => normalizeParsed(resumeParsedData),
    [resumeParsedData],
  );

  const hasRaw = Boolean(resumeRawText?.trim());
  const hasParsed = parsed != null;
  const showPdfPreview = Boolean(previewIsPdf && previewUrl);
  const visible = hasRaw || hasParsed || showPdfPreview;

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
              <h2 className={styles.panelTitle}>Resume</h2>
            </div>
          </header>
          <div className={`${styles.scrollRegion} ${styles.scrollRegionTight}`}>
            <div className={styles.leftStack}>
              {showPdfPreview ? (
                <div className={styles.previewBlock}>
                  <p className={styles.subSectionLabel}>Document preview</p>
                  <div className={styles.previewFrame}>
                    <iframe
                      src={withPdfViewerParams(previewUrl)}
                      className={styles.previewIframe}
                      title={
                        previewFileName
                          ? `Preview of ${previewFileName}`
                          : "Resume PDF preview"
                      }
                    />
                  </div>
                </div>
              ) : null}

              {hasRaw ? (
                <div className={styles.textBlock}>
                  <p className={styles.subSectionLabel}>Extracted text</p>
                  <textarea
                    className={styles.rawTextarea}
                    readOnly
                    value={resumeRawText}
                    aria-label="Extracted resume text"
                    spellCheck={false}
                  />
                </div>
              ) : null}

              {!hasRaw && !showPdfPreview ? (
                <p className={styles.rawPlaceholder}>No resume preview or text available.</p>
              ) : null}
            </div>
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

              <SectionCard
                title="Skills"
                titleAside={
                  <SkillCategoryLegend
                    skills={hasParsed ? parsed.skills : []}
                  />
                }
              >
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
