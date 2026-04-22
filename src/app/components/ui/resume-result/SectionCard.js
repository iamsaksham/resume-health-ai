import styles from "./resumeResultUi.module.css";

export default function SectionCard({
  title,
  titleAside = null,
  children,
  className = "",
}) {
  const showHeader = Boolean(title) || titleAside != null;

  return (
    <section className={`${styles.section} ${className}`.trim()}>
      <div className={styles.sectionBody}>
        {showHeader ? (
          <div className={styles.sectionHeader}>
            {title ? <h3 className={styles.sectionTitle}>{title}</h3> : null}
            {titleAside}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
