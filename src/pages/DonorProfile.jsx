import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDonorById, requestDonationEmail } from "../services/api";

export default function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    getDonorById(id)
      .then(data => {
        setDonor(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading donor...</div>;
  if (!donor) return <div className="min-h-screen flex items-center justify-center">Donor not found!</div>;

  const initials = donor?.name
    ? donor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleScheduleDonation = async () => {
    setRequesting(true);
    try {
      await requestDonationEmail(donor.id);
      alert(`Donation request successfully sent to ${donor.name} via Email! They will contact you shortly.`);
    } catch (error) {
      alert("Failed to send request: " + error.message);
    }
    setRequesting(false);
  };

  return (
    <div className="min-h-screen pt-[100px] pb-16 px-[5%]" style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>
      <button onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-gray-500 hover:text-gray-800">
        ← Back to Donors
      </button>

      {/* Hero banner */}
      <div className="rounded-[28px] p-10 md:p-12 mb-7 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#be123c,#881337)" }}>
        <div className="absolute w-[280px] h-[280px] rounded-full -right-16 -bottom-16"
          style={{ border: "56px solid rgba(255,255,255,.07)" }} />

        <div className="flex items-end gap-6 mb-6 relative z-10 flex-wrap">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-[1.8rem] font-extrabold flex-shrink-0 bg-cover bg-center"
            style={{ 
              backgroundImage: donor?.avatar ? `url(${donor.avatar})` : "linear-gradient(135deg,#ff8a95,white)", 
              border: "4px solid rgba(255,255,255,.3)", 
              color: donor?.avatar ? "transparent" : "#be123c" 
            }}>
            {!donor?.avatar && initials}
          </div>
          <div>
            <h1 className="text-[1.8rem] font-extrabold text-white">{donor.name}</h1>
            <p className="text-white/70 text-sm mt-1 flex items-center gap-3">
              🩸 Registered Donor · 
              {(() => {
                const avail = donor?.availabilityStatus || (donor?.last_donation_date && new Date(donor.last_donation_date) >= new Date(Date.now() - 90*24*60*60*1000) ? 'recently_donated' : (donor?.is_available ? 'available' : 'busy'));
                if (avail === 'recently_donated') {
                  return <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100"> <div className="w-2 h-2 bg-red-500 rounded-full"/> Recently Donated</span>;
                }
                if (avail === 'busy') {
                  return <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-xs font-bold border border-yellow-100"> <div className="w-2 h-2 bg-yellow-500 rounded-full"/> Busy</span>;
                }
                return <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100"> <div className="w-2 h-2 bg-green-500 rounded-full"/> Available</span>;
              })()}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap relative z-10">
          {[
            donor?.blood_type && `💉 ${donor.blood_type}`,
            "❤️ Donor",
            donor?.city && `📍 ${donor.city}`,
            "✅ Verified",
          ].filter(Boolean).map((b) => (
            <div key={b} className="text-white text-xs font-medium px-3.5 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", backdropFilter: "blur(8px)" }}>
              {b}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Info card */}
        <div className="bg-white rounded-[22px] p-7 border border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <h2 className="text-base font-bold text-gray-900 mb-5">Public Donor Details</h2>
          {[
            ["Full Name",   donor?.name     || "—"],
            ["Blood Type",  donor?.blood_type|| "—"],
            ["Weight",      donor?.weight ? donor.weight + ' kg' : "—"],
            ["Location",    donor?.city || "—"],
            ["Last Donated",donor?.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'No recorded date'],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 py-3 border-b border-gray-50 last:border-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
              {label === "Blood Type" && value !== "—" ? (
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 w-fit">{value}</span>
              ) : (
                <span className="text-sm font-medium text-gray-800">{value}</span>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-3 mt-6">
            <button onClick={handleScheduleDonation} disabled={requesting}
              className="w-full py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer transition-all hover:-translate-y-0.5 font-[inherit] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)", boxShadow: "0 6px 20px rgba(193,21,42,.28)" }}>
              {requesting ? "Sending Request..." : "🩸 Request Blood Donation"}
            </button>
            <p className="text-[10px] text-gray-400 text-center">Clicking this automatically securely shares your contact email to this donor.</p>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="bg-white rounded-[22px] p-7 border border-gray-100 grid grid-cols-2 gap-4"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            {[
              { num: donor?.blood_type,  label: "Blood Group",  bg: "#eff6ff", numColor: "#1d4ed8", subColor: "#60a5fa" },
              { num: donor?.status === 'eligible' ? 'Ready' : 'Wait', label: "Current Status", bg: donor?.status === 'eligible' ? "#f0fdf4" : "#fee2e2", numColor: donor?.status === 'eligible' ? "#166534" : "#991b1b", subColor: donor?.status === 'eligible' ? "#4ade80" : "#f87171" },
            ].map((s) => (
              <div key={s.label} className="text-center py-4 rounded-2xl" style={{ background: s.bg }}>
                <div className="text-[1.8rem] font-extrabold leading-none capitalize" style={{ color: s.numColor }}>{s.num}</div>
                <div className="text-xs font-medium mt-1.5" style={{ color: s.subColor }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[22px] p-7 border border-gray-100 flex items-center justify-center py-12"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            <p className="text-sm text-gray-400 text-center max-w-[80%]">
              By requesting blood from <strong>{donor.name}</strong>, LifeFlow sends your name and email instantly. Please only request blood in verified medical emergencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

