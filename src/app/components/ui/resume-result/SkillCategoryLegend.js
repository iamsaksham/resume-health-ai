import { useMemo } from "react";

import {
  getSkillCategory,
  SKILL_CATEGORY_META,
  SKILL_LEGEND_ORDER,
} from "@/utils/skillCategory";

import styles from "./resumeResultUi.module.css";

const swatchClass = {
  backend: styles.legendSwatchBackend,
  frontend: styles.legendSwatchFrontend,
  devops: styles.legendSwatchDevops,
  cloud: styles.legendSwatchCloud,
  data: styles.legendSwatchData,
  mobile: styles.legendSwatchMobile,
  qa: styles.legendSwatchQa,
  general: styles.legendSwatchGeneral,
};

export default function SkillCategoryLegend({ skills }) {
  const activeIds = useMemo(() => {
    if (!Array.isArray(skills) || skills.length === 0) return [];
    const present = new Set();
    for (const s of skills) {
      present.add(getSkillCategory(s));
    }
    return SKILL_LEGEND_ORDER.filter((id) => present.has(id));
  }, [skills]);

  if (activeIds.length === 0) {
    return null;
  }

  return (
    <ul className={styles.skillLegend} aria-label="Skill category colors">
      {activeIds.map((id) => (
        <li key={id} className={styles.skillLegendItem}>
          <span
            className={`${styles.skillLegendSwatch} ${swatchClass[id] ?? ""}`.trim()}
            aria-hidden
          />
          <span
            className={styles.skillLegendLabel}
            title={SKILL_CATEGORY_META[id]?.label ?? id}
          >
            {SKILL_CATEGORY_META[id]?.short ?? id}
          </span>
        </li>
      ))}
    </ul>
  );
}
