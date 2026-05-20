import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDonationCertificate } from "../services/api";

export default function Certificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getDonationCertificate(id)
      .then(setCert)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="text-gray-400 text-lg">Loading certificate...</div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="text-5xl">📄</div>
        <h2 className="text-xl font-bold text-gray-800">Certificate not found</h2>
        <p className="text-gray-500 text-sm">{error || "This donation record does not exist."}</p>
        <button onClick={() => navigate("/donations")} className="text-red-600 font-semibold text-sm hover:underline cursor-pointer">← Back to Donations</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] pb-16 px-[5%]" style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* Action buttons — hidden when printing */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button onClick={() => navigate("/donations")}
          className="text-sm font-semibold text-gray-500 hover:text-red-600 cursor-pointer bg-transparent border-none">
          ← Back to Donations
        </button>
        <button onClick={handlePrint}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer hover:-translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)", boxShadow: "0 6px 20px rgba(193,21,42,.25)" }}>
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Certificate Card */}
      <div ref={certRef}
        className="max-w-[800px] mx-auto bg-white rounded-3xl overflow-hidden print:rounded-none print:shadow-none"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>

        {/* Top red banner */}
        <div className="relative px-10 py-10 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg,#be123c,#881337)" }}>
          <div className="absolute w-[300px] h-[300px] rounded-full -right-20 -top-20"
            style={{ border: "60px solid rgba(255,255,255,.06)" }} />
          <div className="absolute w-[200px] h-[200px] rounded-full -left-12 -bottom-12"
            style={{ border: "40px solid rgba(255,255,255,.06)" }} />

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
              </svg>
            </div>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-wide mb-1">
            Certificate of Donation
          </h1>
          <p className="text-white/60 text-sm font-medium">LifeFlow Blood Donation Platform</p>
        </div>

        {/* Body */}
        <div className="px-10 py-10">
          {/* "This is to certify..." */}
          <div className="text-center mb-10">
            <p className="text-gray-500 text-sm mb-2">This is to certify that</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{cert.donorName}</h2>
            <p className="text-sm text-gray-400">{cert.donorEmail}</p>
          </div>

          {/* Decorative separator */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-2xl">🩸</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Details */}
          <p className="text-center text-gray-600 text-sm leading-relaxed mb-10 max-w-[500px] mx-auto">
            has voluntarily donated <strong className="text-gray-900">{cert.donationType}</strong> on{" "}
            <strong className="text-gray-900">{fmtDate(cert.donationDate)}</strong> at{" "}
            <strong className="text-gray-900">{cert.location}</strong>.
            This selfless act has the potential to save up to <strong className="text-red-600">3 lives</strong>.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Certificate ID", value: cert.certificateId, bg: "#f0f9ff", color: "#1d4ed8" },
              { label: "Blood Type", value: cert.bloodType, bg: "#fff1f2", color: "#be123c" },
              { label: "Donation Type", value: cert.donationType, bg: "#f0fdf4", color: "#166534" },
              { label: "Date", value: fmtDate(cert.donationDate), bg: "#fefce8", color: "#854d0e" },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-2xl" style={{ background: item.bg }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                <p className="text-sm font-extrabold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Decorative separator */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-lg">❤️</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Signature / Footer */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-400 mb-1">Issued on</p>
              <p className="text-sm font-bold text-gray-700">{fmtDate(cert.issuedAt)}</p>
            </div>
            <div className="text-right">
              <div className="mb-2" style={{ borderBottom: "2px solid #e11d48", width: 160, marginLeft: "auto" }} />
              <p className="text-sm font-bold text-gray-700">LifeFlow Team</p>
              <p className="text-xs text-gray-400">Blood Donation Platform</p>
            </div>
          </div>

          {/* Gratitude message */}
          <div className="mt-10 text-center p-5 rounded-2xl" style={{ background: "#fff1f2" }}>
            <p className="text-sm font-bold text-red-700 mb-1">🙏 Thank you for saving lives!</p>
            <p className="text-xs text-red-500">Your generosity makes a real difference in someone's life.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
