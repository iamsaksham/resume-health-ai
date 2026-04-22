const PRESENT_HINTS = new Set([
  "present",
  "current",
  "now",
  "ongoing",
  "till date",
  "till-date",
]);

function normalizeDateString(value) {
  if (value == null) return "";
  return String(value).trim();
}

function isPresentEnd(endDate) {
  const s = normalizeDateString(endDate).toLowerCase();
  if (!s) return true;
  return PRESENT_HINTS.has(s);
}

/**
 * @param {string | null | undefined} value
 * @returns {number | null} epoch ms, or null if unknown
 */
export function parseResumeDate(value) {
  const raw = normalizeDateString(value);
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (PRESENT_HINTS.has(lower)) {
    return Date.now();
  }

  const direct = Date.parse(raw);
  if (!Number.isNaN(direct)) return direct;

  let m = raw.match(/\b(19\d{2}|20\d{2})[-/.](0?[1-9]|1[0-2])\b/);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, 15).getTime();
  }

  m = raw.match(/\b(0?[1-9]|1[0-2])[-/.](19\d{2}|20\d{2})\b/);
  if (m) {
    return new Date(Number(m[2]), Number(m[1]) - 1, 15).getTime();
  }

  m = raw.match(/\b(19\d{2}|20\d{2})\b/);
  if (m) {
    return new Date(Number(m[1]), 6, 15).getTime();
  }

  return null;
}

/**
 * Most recent roles first (current / latest end date on top).
 * @param {Array<{ startDate?: string, endDate?: string | null }>} experience
 * @returns {Array<typeof experience[0]>}
 */
export function sortExperienceDescending(experience) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return [];
  }

  const scored = experience.map((job, index) => {
    const endRaw = job?.endDate;
    const endParsed = isPresentEnd(endRaw)
      ? Date.now()
      : parseResumeDate(endRaw);
    const startParsed = parseResumeDate(job?.startDate);

    const endRank = endParsed ?? -8640000000000000;
    const startRank = startParsed ?? -8640000000000000;

    return { job, endRank, startRank, index };
  });

  scored.sort((a, b) => {
    if (b.endRank !== a.endRank) return b.endRank - a.endRank;
    if (b.startRank !== a.startRank) return b.startRank - a.startRank;
    return a.index - b.index;
  });

  return scored.map((s) => s.job);
}
