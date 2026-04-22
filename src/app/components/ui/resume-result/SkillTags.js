import { getSkillCategory } from "@/utils/skillCategory";

import styles from "./resumeResultUi.module.css";

const tagCategoryClass = {
  backend: styles.tagBackend,
  frontend: styles.tagFrontend,
  devops: styles.tagDevops,
  cloud: styles.tagCloud,
  data: styles.tagData,
  mobile: styles.tagMobile,
  qa: styles.tagQa,
  general: styles.tagGeneral,
};

export default function SkillTags({ skills }) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return <p className={styles.emptyHint}>No skills listed.</p>;
  }

  return (
    <ul className={styles.tags} role="list">
      {skills.map((skill, index) => {
        const cat = getSkillCategory(skill);
        const catClass = tagCategoryClass[cat] ?? styles.tagGeneral;
        return (
          <li
            key={`${skill}-${index}`}
            className={`${styles.tag} ${catClass}`.trim()}
          >
            {skill}
          </li>
        );
      })}
    </ul>
  );
}
