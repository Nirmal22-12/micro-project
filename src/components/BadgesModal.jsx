import { useAuth } from "../context/AuthContext";

const BADGES = [
  {
    id: 1,
    name: "First Drop",
    icon: "🩸",
    color: "#22c55e",
    bg: "#dcfce7",
    border: "#86efac",
    required: 1,
    meaning: "First-time donor",
    reason: "You made your very first blood donation. You have already saved up to 3 lives. This is where every hero begins.",
  },
  {
    id: 2,
    name: "Lifesaver",
    icon: "💙",
    color: "#3b82f6",
    bg: "#dbeafe",
    border: "#93c5fd",
    required: 3,
    meaning: "Helping regularly",
    reason: "You have donated 3 times, meaning you have potentially saved 9 lives. You are now a consistent part of the blood supply chain.",
  },
  {
    id: 3,
    name: "Hero Donor",
    icon: "🦸",
    color: "#8b5cf6",
    bg: "#ede9fe",
    border: "#c4b5fd",
    required: 5,
    meaning: "Strong contributor",
    reason: "5 donations means up to 15 lives touched. You are going beyond occasional giving and making donation a habit.",
  },
  {
    id: 4,
    name: "Blood Champion",
    icon: "🏆",
    color: "#f59e0b",
    bg: "#fef3c7",
    border: "#fcd34d",
    required: 10,
    meaning: "Highly committed",
    reason: "10 donations is a milestone very few reach. You are now a pillar of your local blood supply. Hospitals count on donors like you.",
  },
  {
    id: 5,
    name: "Platinum Saver",
    icon: "⭐",
    color: "#e11d48",
    bg: "#fff1f2",
    border: "#fda4af",
    required: 20,
    meaning: "Elite donor",
    reason: "20 donations puts you in the top tier of all donors nationally. You have potentially saved 60 lives. You are someone's reason for being alive today.",
  },
  {
    id: 6,
    name: "Legend Donor",
    icon: "👑",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    required: 50,
    meaning: "Top-tier lifesaver",
    reason: "50+ donations. You are a legend of the donation community. Your lifetime contribution may have saved over 150 lives. You are extraordinary.",
  },
];

function getCurrentBadge(donations) {
  const earned = BADGES.filter((b) => donations >= b.required);
  return earned.length ? earned[earned.length - 1] : null;
}

function getNextBadge(donations) {
  return BADGES.find((b) => donations < b.required) || null;
}

export default function BadgesModal({ onClose }) {
  const { user } = useAuth();
  const donations   = user?.donations ?? 0;
  const current     = getCurrentBadge(donations);
  const next        = getNextBadge(donations);

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 28, width: "100%", maxWidth: 560,
          maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,.25)",
          animation: "fadeInUp .25s ease",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#9f1239,#e11d48)",
          borderRadius: "28px 28px 0 0", padding: "28px 28px 24px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", border:"40px solid rgba(255,255,255,.06)", right:-40, top:-40 }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <h2 style={{ color:"white", fontSize:20, fontWeight:800, marginBottom:4 }}>🏅 Donor Badges</h2>
              <p style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>
                Earned by {user?.name?.split(" ")[0] || "Donor"} · {donations} donation{donations !== 1 ? "s" : ""} total
              </p>
            </div>
            <button onClick={onClose}
              style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:10, width:32, height:32, cursor:"pointer", color:"white", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
              ✕
            </button>
          </div>

          {/* Current badge highlight */}
          {current ? (
            <div style={{ marginTop:18, background:"rgba(255,255,255,.15)", borderRadius:16, padding:"14px 18px", border:"1px solid rgba(255,255,255,.2)", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ fontSize:32 }}>{current.icon}</div>
              <div>
                <p style={{ color:"white", fontSize:15, fontWeight:700, marginBottom:2 }}>Current Badge: {current.name}</p>
                <p style={{ color:"rgba(255,255,255,.75)", fontSize:12 }}>{current.meaning}</p>
              </div>
            </div>
          ) : (
            <div style={{ marginTop:18, background:"rgba(255,255,255,.15)", borderRadius:16, padding:"14px 18px", border:"1px solid rgba(255,255,255,.2)" }}>
              <p style={{ color:"rgba(255,255,255,.8)", fontSize:13 }}>Make your first donation to earn your first badge!</p>
            </div>
          )}
        </div>

        {/* Progress to next badge */}
        {next && (
          <div style={{ padding:"16px 24px", background:"#f9fafb", borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>
                Progress to <strong style={{ color:"#111827" }}>{next.name}</strong>
              </span>
              <span style={{ fontSize:12, fontWeight:700, color:"#e11d48" }}>
                {donations} / {next.required} donations
              </span>
            </div>
            <div style={{ background:"#e5e7eb", borderRadius:100, height:8, overflow:"hidden" }}>
              <div style={{
                height:"100%", borderRadius:100,
                background:"linear-gradient(90deg,#f43f5e,#be123c)",
                width:`${Math.min((donations / next.required) * 100, 100)}%`,
                transition:"width .5s ease",
              }} />
            </div>
            <p style={{ fontSize:11, color:"#9ca3af", marginTop:6 }}>
              {next.required - donations} more donation{next.required - donations !== 1 ? "s" : ""} needed to unlock {next.name}
            </p>
          </div>
        )}

        {/* All badges list */}
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:12 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>
            All Badges
          </p>
          {BADGES.map((b) => {
            const earned = donations >= b.required;
            return (
              <div key={b.id}
                style={{
                  display:"flex", alignItems:"flex-start", gap:14,
                  padding:"14px 16px", borderRadius:16,
                  background: earned ? b.bg : "#f9fafb",
                  border: `1.5px solid ${earned ? b.border : "#f3f4f6"}`,
                  opacity: earned ? 1 : 0.55,
                  transition:"all .2s",
                }}>
                {/* Icon */}
                <div style={{
                  width:44, height:44, borderRadius:14, flexShrink:0,
                  background: earned ? "white" : "#e5e7eb",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, boxShadow: earned ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                }}>
                  {earned ? b.icon : "🔒"}
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color: earned ? "#111827" : "#6b7280" }}>
                      {b.name}
                    </span>
                    <span style={{
                      fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:100,
                      background: earned ? b.bg : "#e5e7eb",
                      color: earned ? b.color : "#9ca3af",
                      border: `1px solid ${earned ? b.border : "#d1d5db"}`,
                    }}>
                      {earned ? "✓ Earned" : `${b.required} donations`}
                    </span>
                  </div>
                  <p style={{ fontSize:12, fontWeight:600, color: earned ? b.color : "#9ca3af", marginBottom:4 }}>
                    {b.meaning}
                  </p>
                  <p style={{ fontSize:12, color: earned ? "#4b5563" : "#9ca3af", lineHeight:1.6 }}>
                    {earned ? b.reason : `Donate ${b.required} times to unlock this badge.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:"0 24px 24px" }}>
          <div style={{ background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:14, padding:"12px 16px", textAlign:"center" }}>
            <p style={{ fontSize:12, color:"#9f1239", lineHeight:1.6 }}>
              💡 Badges update automatically when your donation count increases after backend integration.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}