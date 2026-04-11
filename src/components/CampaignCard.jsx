import { useNavigate } from "react-router-dom";

const gradients = [
  "linear-gradient(135deg,#b91c1c,#7f1d1d)",
  "linear-gradient(135deg,#9f1239,#4c0519)",
  "linear-gradient(135deg,#7f1d1d,#3f0006)",
];

export default function CampaignCard({ campaign, index = 0 }) {
  const navigate = useNavigate();
  const pct = Math.round((campaign.current / campaign.goal) * 100);

  return (
    <div
      className="bg-white rounded-[22px] overflow-hidden border border-gray-100 cursor-pointer group transition-all duration-300 hover:-translate-y-1.5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,.14)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.06)")}
    >
      {/* Image area */}
      <div className="h-44 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center transition-transform duration-400 group-hover:scale-105" style={{ background: gradients[index % gradients.length] }}>
          <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
            <path d="M40 15C40 15 18 35 18 50C18 62 28 70 40 70C52 70 62 62 62 50C62 35 40 15 40 15Z" fill="rgba(255,100,100,.55)" />
            <rect x="33" y="52" width="14" height="5" rx="2.5" fill="rgba(255,255,255,.7)" />
            <rect x="37.5" y="45" width="5" height="14" rx="2.5" fill="rgba(255,255,255,.7)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 to-red-800/30" />
        <span className="absolute top-3 left-3 bg-white/95 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
          {campaign.type}
        </span>
        <span
          className="absolute top-3 right-3 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: campaign.urgencyColor || "#dc2626" }}
        >
          {campaign.urgencyLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold mb-2">
          📍 {campaign.location}
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">{campaign.title}</h3>
        <div className="flex items-center gap-3.5 text-gray-400 text-xs mb-4">
          <span>📅 {campaign.date}</span>
          <span>🕘 {campaign.time}</span>
        </div>
        {/* Progress */}
        <div className="bg-red-50 rounded-full h-1.5 mb-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>{pct}% of goal</span>
          <span>{campaign.current} / {campaign.goal} donors</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">{campaign.goal - campaign.current} spots left</span>
          <button
            onClick={() => navigate("/donors/add")}
            className="px-4 py-2 rounded-xl text-white text-xs font-bold border-none cursor-pointer transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)", boxShadow: "0 4px 16px rgba(193,21,42,.3)" }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
