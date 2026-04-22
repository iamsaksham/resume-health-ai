/**
 * Chrome / Chromium built-in PDF viewer hash parameters.
 * `zoom=page-width` fits the page width to the viewer (largest practical zoom in a narrow column).
 */
export const PDF_VIEWER_HASH =
  "toolbar=0&navpanes=0&page=1&zoom=page-width";

export function withPdfViewerParams(blobUrl) {
  if (!blobUrl || typeof blobUrl !== "string") return "";
  const base = blobUrl.split("#")[0];
  return `${base}#${PDF_VIEWER_HASH}`;
}
