import styles from "./resumeResultUi.module.css";

export default function EducationList({ education }) {
  if (!Array.isArray(education) || education.length === 0) {
    return <p className={styles.emptyHint}>No education entries.</p>;
  }

  return (
    <ul className={styles.eduList}>
      {education.map((edu, index) => (
        <li key={`${edu.institution}-${index}`} className={styles.eduItem}>
          <span className={styles.eduInstitution}>{edu.institution}</span>
          <span className={styles.eduMeta}>{edu.degree}</span>
          <span className={styles.eduYear}>{edu.year}</span>
        </li>
      ))}
    </ul>
  );
}
