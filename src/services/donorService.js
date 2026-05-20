/**
 * donorService.js
 * All donor CRUD operations backed by localStorage.
 * Swap the internals with real API calls when backend is ready.
 */

const DONORS_KEY = "lifeflow_donors";

/* No seed data — only real registered donors are shown */
const SEED_DONORS = [];

/* Returns existing saved donors */
export function getDonors() {
  try {
    const raw = localStorage.getItem(DONORS_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  } catch {
    return [];
  }
}

/* Save a new donor submitted from AddDonor form */
export function saveDonor(formData, eligibilityStatus) {
  const donors  = getDonors();
  const name    = `${formData.firstName} ${formData.lastName}`.trim();
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  /* Random avatar gradient */
  const GRADS = [
    "linear-gradient(135deg,#e11d48,#9f1239)",
    "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    "linear-gradient(135deg,#14b8a6,#0d9488)",
    "linear-gradient(135deg,#f97316,#c2410c)",
    "linear-gradient(135deg,#ec4899,#be185d)",
  ];
  const bg = GRADS[donors.length % GRADS.length];

  /* Compute approximate age from DOB */
  let age = "—";
  if (formData.dob) {
    const diff = Date.now() - new Date(formData.dob).getTime();
    age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  const newDonor = {
    id:          `donor-${Date.now()}`,
    initials,
    name,
    email:       formData.email      || "—",
    blood:       formData.bloodType,
    age,
    location: [formData.city, formData.pincode].filter(Boolean).join(" · ") || formData.address?.split(",").pop()?.trim() || "—",
    lastDonated: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    count:       1,
    status:      eligibilityStatus,   // "eligible" | "temporary" | "permanent"
    bg,
    phone:       formData.phone      || "—",
    gender:      formData.gender     || "—",
    weight:      formData.weight     || "—",
    address:     formData.address    || "—",
    hemoglobin:  formData.hemoglobin || "—",
    registeredAt: new Date().toISOString(),
  };

  donors.unshift(newDonor); /* newest first */
  localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
  return newDonor;
}

/* Delete a donor by id */
export function deleteDonor(id) {
  const donors = getDonors().filter((d) => d.id !== id);
  localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
}

/* Reset back to seed data (dev helper) */
export function resetDonors() {
  localStorage.setItem(DONORS_KEY, JSON.stringify(SEED_DONORS));
}
