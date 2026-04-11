import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FormInput, FormSelect, FormTextarea } from "../components/FormInput";
import { EligibilityCard, StatusBadge } from "../components/EligibilityCard";
import { addDonor } from "../services/api";

const PERM_ITEMS = [
  { key:"cancer",    label:"Blood cancer (Leukemia / Lymphoma)" },
  { key:"hiv",       label:"HIV / AIDS" },
  { key:"hepatitis", label:"Hepatitis B or C" },
  { key:"heart",     label:"Chronic Heart Disease" },
];
const TEMP_ITEMS = [
  { key:"alcohol",   label:"Alcohol consumption (past 24 h)" },
  { key:"fever",     label:"Current fever (> 37.5 °C)" },
  { key:"infection", label:"Active infection or cold" },
  { key:"vaccine",   label:"Recent vaccination (past 2 weeks)" },
];

const initPerm = { cancer:null, hiv:null, hepatitis:null, heart:null };
const initTemp = { alcohol:null, fever:null, infection:null, vaccine:null };

function allAnswered(obj) {
  return Object.values(obj).every((v) => v !== null && v !== undefined);
}
function deriveStatus(perm, temp) {
  if (!allAnswered(perm) || !allAnswered(temp)) return "unanswered";
  if (Object.values(perm).some(Boolean)) return "permanent";
  if (Object.values(temp).some(Boolean)) return "temporary";
  return "eligible";
}

export default function AddDonor() {
  const navigate      = useNavigate();
  const { user }      = useAuth();

const [form, setForm] = useState({
  firstName:"", lastName:"", dob:"", gender:"", bloodType:"",
  weight:"", phone:"", email:"", address:"",
  city:"", state:"", country:"India", pincode:"",
  lastDonation:"", hemoglobin:"", medNotes:"",
});
  const [perm, setPerm]           = useState({ ...initPerm });
  const [temp, setTemp]           = useState({ ...initTemp });
  const [errors, setErrors]       = useState({});
  const [showEligErr, setShowEligErr] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedName, setSavedName] = useState("");

  const status    = deriveStatus(perm, temp);
  const canSubmit = status === "eligible";

  const handleField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const handlePerm  = (k, v) => setPerm((p) => ({ ...p, [k]: v }));
  const handleTemp  = (k, v) => setTemp((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName  = "Required";
    if (!form.lastName.trim())   e.lastName   = "Required";
    if (!form.dob)               e.dob        = "Required";
    if (!form.gender)            e.gender     = "Required";
    if (!form.bloodType)         e.bloodType  = "Required";
    if (!form.weight)            e.weight     = "Required";
    else if (Number(form.weight) < 50) e.weight = "Minimum 50 kg";
    if (!form.phone.trim())      e.phone      = "Required";
    if (!form.address.trim())    e.address    = "Required";
    if (!form.city.trim())       e.city       = "Required";
    if (!form.pincode.trim())    e.pincode    = "Required";
    if (!form.state.trim())      e.state      = "Required";
    if (!form.country.trim())    e.country    = "Required";
  
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setShowEligErr(true);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!canSubmit) return;

    try {
      // Transmit to the Express PostgreSQL Backend
      await addDonor({
        blood_type: form.bloodType,
        last_donation_date: form.lastDonation || null,
        status: status,
        weight: Number(form.weight),
        phone_number: form.phone
      });

      setSavedName(`${form.firstName} ${form.lastName}`);
      setSubmitted(true);
    } catch (err) {
      alert("Error saving donor to the database: " + (err.message || "Unknown error"));
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-[5%]"
        style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>
        <div className="text-center max-w-md bg-white rounded-3xl p-12 border border-gray-100"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Donor Registered!</h2>
          <p className="text-gray-400 mb-2">
            <strong className="text-gray-700">{savedName}</strong> ({form.bloodType}) has been successfully saved to the donor registry.
          </p>
          <p className="text-xs text-gray-400 mb-8">The record is now visible in the Donors list.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate("/donors")}
              className="px-6 py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer font-[inherit]"
              style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)", boxShadow: "0 6px 20px rgba(193,21,42,.28)" }}>
              View Donor List →
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ firstName:"",lastName:"",dob:"",gender:"",bloodType:"",weight:"",phone:"",email:"",address:"",lastDonation:"",hemoglobin:"",medNotes:"" }); setPerm({...initPerm}); setTemp({...initTemp}); setErrors({}); setShowEligErr(false); }}
              className="px-6 py-3 rounded-2xl text-gray-600 text-sm font-semibold border border-gray-200 bg-white cursor-pointer font-[inherit] hover:bg-gray-50 transition-all">
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StepNum = ({ n, done }) => (
    <span className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
      style={{ background: done ? "#22c55e" : "#e11d48" }}>
      {done ? "✓" : n}
    </span>
  );
  const personalDone = !!(form.firstName && form.lastName && form.dob && form.gender && form.bloodType && form.weight && form.phone && form.address);
  const eligDone     = allAnswered(perm) && allAnswered(temp);

  return (
    <div className="min-h-screen pt-[100px] pb-16 px-[5%]"
      style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wide mb-3">
            Donor Registration
          </div>
          <h1 className="text-[2rem] font-extrabold text-gray-900 mb-2">Register as a Blood Donor</h1>
          <p className="text-gray-400 text-sm">
            Logged in as <strong className="text-gray-700">{user?.name}</strong> · Fill in all fields and complete the eligibility check.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8 bg-white rounded-2xl px-6 py-4 border border-gray-100"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          {[
            { n:"1", label:"Personal Info", done: personalDone },
            { n:"2", label:"Medical Info",  done: true },
            { n:"3", label:"Eligibility",   done: eligDone },
          ].map((s, i, arr) => (
            <div key={s.n} className="flex items-center gap-3 flex-1">
              <StepNum n={s.n} done={s.done} />
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{s.label}</span>
              {i < arr.length - 1 && <div className="flex-1 h-px bg-gray-200 hidden sm:block" />}
            </div>
          ))}
        </div>

        {/* ── Section 1: Personal Info ── */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 mb-6"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <StepNum n="1" done={personalDone} />
            <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
          </div>
          <p className="text-xs text-gray-400 mb-7 pl-9">All fields marked <span className="text-red-500">*</span> are required</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="First Name" required placeholder="Enter first name"
              value={form.firstName} onChange={(e) => handleField("firstName", e.target.value)} error={errors.firstName} />
            <FormInput label="Last Name" required placeholder="Enter last name"
              value={form.lastName} onChange={(e) => handleField("lastName", e.target.value)} error={errors.lastName} />
            <FormInput label="Date of Birth" required type="text" placeholder="YYYY-MM-DD"
              value={form.dob} onChange={(e) => handleField("dob", e.target.value)} error={errors.dob} />
            <FormSelect label="Gender" required value={form.gender}
              onChange={(e) => handleField("gender", e.target.value)} error={errors.gender}>
              <option value="">Select gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </FormSelect>
            <FormSelect label="Blood Type" required value={form.bloodType}
              onChange={(e) => handleField("bloodType", e.target.value)} error={errors.bloodType}>
              <option value="">Select blood type</option>
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((t) => <option key={t}>{t}</option>)}
            </FormSelect>
            <FormInput label="Weight (kg)" required type="number" placeholder="Minimum 50 kg"
              value={form.weight} onChange={(e) => handleField("weight", e.target.value)} error={errors.weight} />
            <FormInput label="Phone Number" required type="tel" placeholder="+91 XXXXX XXXXX"
              value={form.phone} onChange={(e) => handleField("phone", e.target.value)} error={errors.phone} />
            <FormInput label="Email Address" type="email" placeholder="your@email.com"
              value={form.email} onChange={(e) => handleField("email", e.target.value)} />
            <FormTextarea label="Street Address" required placeholder="House no, street, area"
              value={form.address} onChange={(e) => handleField("address", e.target.value)}
               error={errors.address} className="md:col-span-2" />

            <FormInput label="City" required placeholder="e.g. Silchar"
              value={form.city} onChange={(e) => handleField("city", e.target.value)}
              error={errors.city} />

            <FormInput label="Pincode" required placeholder="e.g. 788001"
              value={form.pincode} onChange={(e) => handleField("pincode", e.target.value)}
              error={errors.pincode} />

            <FormInput label="State" required placeholder="e.g. Assam"
  value={form.state} onChange={(e) => handleField("state", e.target.value)}
              error={errors.state} />

              <FormInput label="Country" required placeholder="e.g. India"
                value={form.country} onChange={(e) => handleField("country", e.target.value)}
              error={errors.country} />
          </div>
        </div>

        {/* ── Section 2: Medical ── */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 mb-6"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <StepNum n="2" done />
            <h2 className="text-base font-bold text-gray-900">Medical Information</h2>
          </div>
          <p className="text-xs text-gray-400 mb-7 pl-9">Optional — helps ensure a safe donation</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Last Donation Date" type="date"
              value={form.lastDonation} onChange={(e) => handleField("lastDonation", e.target.value)} />
            <FormInput label="Hemoglobin Level (g/dL)" type="number" step="0.1" placeholder="e.g. 13.5"
              value={form.hemoglobin} onChange={(e) => handleField("hemoglobin", e.target.value)} />
            <FormTextarea label="Additional Medical Notes" placeholder="Any other relevant information…"
              value={form.medNotes} onChange={(e) => handleField("medNotes", e.target.value)} className="md:col-span-2" />
          </div>
        </div>

        {/* ── Section 3: Eligibility ── */}
        <div className="bg-white rounded-3xl p-10 border mb-6"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.06)", borderColor: showEligErr && !eligDone ? "#fca5a5" : "#f3f4f6" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <StepNum n="3" done={eligDone} />
            <h2 className="text-base font-bold text-gray-900">Donation Eligibility Check <span className="text-red-500">*</span></h2>
          </div>
          <p className="text-xs text-gray-400 mb-7 pl-9">
            Select <strong>Yes</strong> or <strong>No</strong> for every condition. All questions are required.
          </p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-7">
            <span className="text-lg mt-0.5">ℹ️</span>
            <p className="text-xs text-blue-700 leading-5">
              Answer <strong>No</strong> if you do not have the condition, <strong>Yes</strong> if you do. Every question must be answered to enable submission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
            <EligibilityCard type="permanent" title="Permanent Disqualification"
              subtitle="Have you ever been diagnosed with any of these?"
              items={PERM_ITEMS} values={perm} onChange={handlePerm} showErrors={showEligErr} />
            <EligibilityCard type="temporary" title="Temporary Disqualification"
              subtitle="Do you currently have or recently experience any of these?"
              items={TEMP_ITEMS} values={temp} onChange={handleTemp} showErrors={showEligErr} />
          </div>

          <StatusBadge status={status} />

          {status === "permanent" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium flex items-start gap-3">
              ⛔ Based on your responses, you are permanently disqualified from donating blood. Please consult a healthcare professional.
            </div>
          )}
          {showEligErr && status === "unanswered" && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium flex items-start gap-3">
              📋 You must answer every Yes / No question in both sections before submitting.
            </div>
          )}
        </div>

        {/* ── Submit bar ── */}
        <div className="bg-white rounded-3xl px-10 py-7 border border-gray-100 flex items-center justify-between flex-wrap gap-4"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <button onClick={() => navigate("/donors")}
            className="px-7 py-3.5 bg-white text-gray-600 border border-gray-200 rounded-2xl text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-all font-[inherit]">
            ← Cancel
          </button>
          <div className="flex items-center gap-4 flex-wrap">
            {showEligErr && !eligDone && <span className="text-xs font-semibold text-red-500">⚠ Complete eligibility check</span>}
            {showEligErr && eligDone && status === "permanent" && <span className="text-xs font-semibold text-red-500">⛔ Permanently disqualified</span>}
            {showEligErr && eligDone && status === "temporary" && <span className="text-xs font-semibold text-amber-600">⚠ Temporarily ineligible</span>}
            <button onClick={handleSubmit}
              className="px-9 py-3.5 rounded-2xl text-white text-sm font-bold border-none cursor-pointer transition-all duration-200 font-[inherit]"
              style={{
                background: canSubmit ? "linear-gradient(135deg,#f43f5e,#be123c)" : "#9ca3af",
                boxShadow:  canSubmit ? "0 8px 32px rgba(193,21,42,.28)" : "none",
              }}>
              {canSubmit ? "Save & Register Donor →" : status === "unanswered" ? "Answer All Questions First" : "Not Eligible to Register"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
