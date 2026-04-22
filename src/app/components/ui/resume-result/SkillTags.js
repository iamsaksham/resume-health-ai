import styles from "./resumeResultUi.module.css";

export default function SkillTags({ skills }) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return <p className={styles.emptyHint}>No skills listed.</p>;
  }

  return (
    <ul className={styles.tags} role="list">
      {skills.map((skill, index) => (
        <li key={`${skill}-${index}`} className={styles.tag}>
          {skill}
        </li>
      ))}
    </ul>
  );
}
