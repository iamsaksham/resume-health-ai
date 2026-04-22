import styles from "./resumeResultUi.module.css";

function formatDates(startDate, endDate) {
  const end = endDate == null || endDate === "" ? "Present" : endDate;
  if (!startDate && !end) return "";
  if (!startDate) return end;
  return `${startDate} — ${end}`;
}

export default function ExperienceList({ experience }) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return <p className={styles.emptyHint}>No experience entries.</p>;
  }

  return (
    <div>
      {experience.map((job, index) => (
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
