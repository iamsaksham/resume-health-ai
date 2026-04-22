import { Fragment } from "react";

import styles from "./resumeResultUi.module.css";

export default function BasicInfoFields({ name, email, phone }) {
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
  ];

  return (
    <div className={styles.fieldGrid}>
      {rows.map(([label, value]) => (
        <Fragment key={label}>
          <div className={styles.fieldLabel}>{label}</div>
          <div className={styles.fieldValue}>{value || "—"}</div>
        </Fragment>
      ))}
    </div>
  );
}
