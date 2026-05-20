import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDonations, addDonation } from "../services/api";

const TYPES = ["Whole Blood", "Platelet", "Plasma", "Double Red Cells"];

export default function Donations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ donation_type: "Whole Blood", donation_date: "", location: "", notes: "" });
  const [error, setError] = useState("");

  const fetchDonations = () => {
    setLoading(true);
    getMyDonations()
      .then(setDonations)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.donation_date) { setError("Please select a date"); return; }
    setSaving(true);
    setError("");
    try {
      await addDonation(form);
      setForm({ donation_type: "Whole Blood", donation_date: "", location: "", notes: "" });
      setShowForm(false);
      fetchDonations();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  const typeIcon = (t) => t === "Platelet" ? "💊" : t === "Plasma" ? "🧬" : t === "Double Red Cells" ? "🔴" : "🩸";

  return (
    <div className="min-h-screen pt-[100px] pb-16 px-[5%]" style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Donation History</h1>
          <p className="text-sm text-gray-400 mt-1">Track your donations and download certificates</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer hover:-translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)", boxShadow: "0 6px 20px rgba(193,21,42,.25)" }}>
          {showForm ? "✕ Cancel" : "+ Log Donation"}
        </button>
      </div>

      {/* Add Donation Form */}
      {showForm && (
        <div className="bg-white rounded-[22px] p-7 border border-gray-100 mb-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <h3 className="text-base font-bold text-gray-900 mb-5">Log a New Donation</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Donation Type</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm font-medium focus:border-red-400 bg-white"
                value={form.donation_type} onChange={(e) => setForm({ ...form, donation_type: e.target.value })}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date *</label>
              <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm font-medium focus:border-red-400"
                value={form.donation_date} onChange={(e) => setForm({ ...form, donation_date: e.target.value })}
                max={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
              <input type="text" placeholder="e.g. Red Cross Guwahati" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm font-medium focus:border-red-400"
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
              <input type="text" placeholder="Any additional notes" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm font-medium focus:border-red-400"
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <button type="submit" disabled={saving}
                className="px-8 py-2.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)" }}>
                {saving ? "Saving..." : "Save Donation"}
              </button>
              {error && <span className="text-red-500 text-sm">{error}</span>}
            </div>
          </form>
        </div>
      )}

      {/* Donations List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading donations...</div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-[22px] p-12 text-center border border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <div className="text-5xl mb-4">🩸</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No donations yet</h3>
          <p className="text-sm text-gray-400 mb-6">Log your first donation to get your certificate!</p>
          <button onClick={() => setShowForm(true)}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)" }}>
            + Log Your First Donation
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[22px] border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <div className="px-7 py-5 flex items-center justify-between border-b border-gray-50">
            <h3 className="text-base font-bold text-gray-900">Your Donations</h3>
            <span className="text-xs text-red-500 font-medium">{donations.length} record{donations.length !== 1 ? "s" : ""}</span>
          </div>
          {donations.map((d) => (
            <div key={d.id} className="flex items-center gap-4 px-7 py-4 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center text-xl flex-shrink-0">
                {typeIcon(d.donation_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{d.donation_type} Donation</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {d.location || "LifeFlow Center"} · {fmtDate(d.donation_date)}
                </p>
              </div>
              <button onClick={() => navigate(`/donations/${d.id}/certificate`)}
                className="px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer hover:-translate-y-0.5 transition-all flex items-center gap-1.5 flex-shrink-0"
                style={{ color: "#be123c", background: "#fff1f2", border: "1px solid #fecdd3" }}>
                📄 Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
