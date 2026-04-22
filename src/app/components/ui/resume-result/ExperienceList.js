import { useMemo } from "react";

import { sortExperienceDescending } from "@/utils/sortExperienceDesc";

import styles from "./resumeResultUi.module.css";

function formatDates(startDate, endDate) {
  const end = endDate == null || endDate === "" ? "Present" : endDate;
  if (!startDate && !end) return "";
  if (!startDate) return end;
  return `${startDate} — ${end}`;
}

export default function ExperienceList({ experience }) {
  const ordered = useMemo(
    () => sortExperienceDescending(experience),
    [experience],
  );

  if (!Array.isArray(ordered) || ordered.length === 0) {
    return <p className={styles.emptyHint}>No experience entries.</p>;
  }

  return (
    <div>
      {ordered.map((job, index) => (
        <article
          key={`${job.company}-${job.role}-${index}`}
          className={styles.expCard}
        >
          <h4 className={styles.expCompany}>{job.company}</h4>
          <p className={styles.expRole}>{job.role}</p>
          <p className={styles.expDates}>{formatDates(job.startDate, job.endDate)}</p>
          <p className={styles.expDesc}>{job.description}</p>
        </article>
      ))}
    </div>
  );
}
