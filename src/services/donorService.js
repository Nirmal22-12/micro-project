/**
 * donorService.js
 * All donor CRUD operations backed by localStorage.
 * Swap the internals with real API calls when backend is ready.
 */

const DONORS_KEY = "hemolife_donors";

/* ── Seed data shown before any real submissions ── */
const SEED_DONORS = [
  { id:"seed-1", initials:"RK", name:"Rahul Kumar",  email:"rahul@example.com",  blood:"O+",  age:28, location:"Silchar",    lastDonated:"Apr 3, 2026",  count:12, status:"eligible",  bg:"linear-gradient(135deg,#e11d48,#9f1239)",  phone:"+91 98765 11111", gender:"Male",   weight:"74", address:"MG Road, Silchar" },
  { id:"seed-2", initials:"PM", name:"Priya Mehta",  email:"priya@example.com",  blood:"AB-", age:32, location:"Guwahati",   lastDonated:"Feb 12, 2026", count:7,  status:"temporary", bg:"linear-gradient(135deg,#f97316,#ea580c)",  phone:"+91 98765 22222", gender:"Female", weight:"58", address:"Paltan Bazar, Guwahati" },
  { id:"seed-3", initials:"AS", name:"Arjun Singh",  email:"arjun@example.com",  blood:"B+",  age:24, location:"Imphal",     lastDonated:"Mar 28, 2026", count:3,  status:"eligible",  bg:"linear-gradient(135deg,#8b5cf6,#7c3aed)",  phone:"+91 98765 33333", gender:"Male",   weight:"68", address:"Keishamthong, Imphal" },
  { id:"seed-4", initials:"ND", name:"Nisha Das",    email:"nisha@example.com",  blood:"A+",  age:29, location:"Dibrugarh",  lastDonated:"Jan 5, 2026",  count:18, status:"permanent", bg:"linear-gradient(135deg,#ec4899,#db2777)",  phone:"+91 98765 44444", gender:"Female", weight:"55", address:"AT Road, Dibrugarh" },
  { id:"seed-5", initials:"VB", name:"Vikram Bose",  email:"vikram@example.com", blood:"O-",  age:35, location:"Silchar",    lastDonated:"Apr 1, 2026",  count:21, status:"eligible",  bg:"linear-gradient(135deg,#14b8a6,#0d9488)",  phone:"+91 98765 55555", gender:"Male",   weight:"78", address:"Rangirkhari, Silchar" },
  { id:"seed-6", initials:"SR", name:"Sunita Roy",   email:"sunita@example.com", blood:"A-",  age:41, location:"Agartala",   lastDonated:"Mar 15, 2026", count:9,  status:"eligible",  bg:"linear-gradient(135deg,#f59e0b,#d97706)",  phone:"+91 98765 66666", gender:"Female", weight:"62", address:"Battala, Agartala" },
];

/* Returns existing saved donors OR seeds defaults once */
export function getDonors() {
  try {
    const raw = localStorage.getItem(DONORS_KEY);
    if (raw) return JSON.parse(raw);
    /* First run — save seeds */
    localStorage.setItem(DONORS_KEY, JSON.stringify(SEED_DONORS));
    return SEED_DONORS;
  } catch {
    return SEED_DONORS;
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
