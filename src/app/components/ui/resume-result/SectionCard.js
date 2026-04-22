import styles from "./resumeResultUi.module.css";

export default function SectionCard({ title, children, className = "" }) {
  return (
    <section className={`${styles.section} ${className}`.trim()}>
      <div className={styles.sectionBody}>
        {title ? <h3 className={styles.sectionTitle}>{title}</h3> : null}
        {children}
      </div>
    </section>
  );
}
