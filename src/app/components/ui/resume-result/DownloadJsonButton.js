import styles from "./DownloadJsonButton.module.css";

function triggerDownload(data, filename = "resume-structured.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function DownloadJsonButton({ data, disabled, className = "" }) {
  const canDownload = data != null && typeof data === "object";

  return (
    <button
      type="button"
      className={`${styles.btn} ${className}`.trim()}
      disabled={disabled || !canDownload}
      onClick={() => canDownload && triggerDownload(data)}
    >
      Download JSON
    </button>
  );
}
