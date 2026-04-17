/**
 * Cosmic theme — JavaScript palette mirror of `colors.css`.
 * Keep hex values aligned with :root --palette-* in colors.css.
 */
export const palette = Object.freeze({
  deepSpace: "#1A0B2E",
  nebula: "#3B1E5A",
  cosmicBlue: "#1F3C88",
  magentaGlow: "#C43EFF",
  starPink: "#FF4DA6",
  textPrimary: "#EDE4F7",
  pureWhite: "#FFFFFF",
});

/** Semantic names for use in JS (charts, inline styles, etc.) */
export const semantic = Object.freeze({
  bgBase: palette.deepSpace,
  bgElevated: palette.nebula,
  accentBlue: palette.cosmicBlue,
  accentMagenta: palette.magentaGlow,
  accentPink: palette.starPink,
  textPrimary: palette.textPrimary,
});
