/**
 * Eligibility utility — pure functions, no React dependency.
 * Import anywhere in the app to compute donor eligibility status.
 */

export const PERMANENT_CONDITIONS = [
  { key: "cancer",    label: "Blood cancer (Leukemia / Lymphoma)" },
  { key: "hiv",       label: "HIV / AIDS" },
  { key: "hepatitis", label: "Hepatitis B or C" },
  { key: "heart",     label: "Chronic Heart Disease" },
];

export const TEMPORARY_CONDITIONS = [
  { key: "alcohol",   label: "Alcohol consumption (past 24 h)" },
  { key: "fever",     label: "Current fever (> 37.5 °C)" },
  { key: "infection", label: "Active infection or cold" },
  { key: "vaccine",   label: "Recent vaccination (past 2 weeks)" },
];

/**
 * @param {{ [key: string]: boolean }} permValues   — permanent condition flags
 * @param {{ [key: string]: boolean }} tempValues   — temporary condition flags
 * @returns {"eligible"|"temporary"|"permanent"}
 */
export function computeEligibility(permValues, tempValues) {
  if (Object.values(permValues).some(Boolean)) return "permanent";
  if (Object.values(tempValues).some(Boolean)) return "temporary";
  return "eligible";
}

/**
 * Human-readable label for each status.
 */
export const STATUS_META = {
  eligible: {
    label: "Eligible to Donate",
    color: "green",
    message: "You meet all eligibility requirements and may proceed with registration.",
  },
  temporary: {
    label: "Temporarily Ineligible",
    color: "amber",
    message:
      "You can donate after recovery or the required waiting period. Please check back when you feel better.",
  },
  permanent: {
    label: "Permanently Ineligible",
    color: "red",
    message:
      "One or more conditions permanently disqualify you from donating blood. Please consult a healthcare professional.",
  },
};

/**
 * Minimum eligibility requirements for weight / age (WHO guidelines).
 */
export const MIN_WEIGHT_KG = 50;
export const MIN_AGE_YEARS = 17;
export const MAX_AGE_YEARS = 65;

/**
 * Quick weight / age check on top of medical eligibility.
 * Returns null if valid, or an error string.
 */
export function validateBasicCriteria({ weightKg, ageYears }) {
  if (weightKg !== undefined && weightKg < MIN_WEIGHT_KG)
    return `Donor must weigh at least ${MIN_WEIGHT_KG} kg.`;
  if (ageYears !== undefined && (ageYears < MIN_AGE_YEARS || ageYears > MAX_AGE_YEARS))
    return `Donor must be between ${MIN_AGE_YEARS} and ${MAX_AGE_YEARS} years old.`;
  return null;
}
