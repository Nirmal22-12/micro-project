import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDonors } from "../services/donorService";

const BADGES = [
  { id:1, icon:"🩸", name:"First Drop",     meaning:"First-time donor",   required:1,  color:"#22c55e", bg:"#dcfce7", border:"#86efac", reason:"You made your very first blood donation. You have already saved up to 3 lives. This is where every hero begins." },
  { id:2, icon:"💙", name:"Lifesaver",       meaning:"Helping regularly",  required:3,  color:"#3b82f6", bg:"#dbeafe", border:"#93c5fd", reason:"You have donated 3 times, potentially saving 9 lives. You are now a consistent part of the blood supply chain." },
  { id:3, icon:"🦸", name:"Hero Donor",      meaning:"Strong contributor", required:5,  color:"#8b5cf6", bg:"#ede9fe", border:"#c4b5fd", reason:"5 donations means up to 15 lives touched. You are making donation a real habit and hospitals notice it." },
  { id:4, icon:"🏆", name:"Blood Champion",  meaning:"Highly committed",   required:10, color:"#f59e0b", bg:"#fef3c7", border:"#fcd34d", reason:"10 donations is a milestone very few reach. You are a pillar of your local blood supply." },
  { id:5, icon:"⭐", name:"Platinum Saver",  meaning:"Elite donor",        required:20, color:"#e11d48", bg:"#fff1f2", border:"#fda4af", reason:"20 donations puts you in the top tier nationally. You have potentially saved 60 lives." },
  { id:6, icon:"👑", name:"Legend Donor",    meaning:"Top-tier lifesaver", required:50, color:"#7c3aed", bg:"#f5f3ff", border:"#c4b5fd", reason:"50+ donations. Your lifetime contribution may have saved over 150 lives. You are extraordinary." },
];

const GRAD_COLORS = [
  "linear-gradient(135deg,#e11d48,#9f1239)",
  "linear-gradient(135deg,#f97316,#ea580c)",
  "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  "linear-gradient(135deg,#ec4899,#db2777)",
  "linear-gradient(135deg,#14b8a6,#0d9488)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
];

function getCurrentBadge(donations) {
  const earned = BADGES.filter((b) => donations >= b.required);
  return earned.length ? earned[earned.length - 1] : null;
}

function getNextBadge(donations) {
  return BADGES.find((b) => donations < b.required) || null;
}

export default function BadgesPage() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const donations   = user?.donations ?? 0;
  const current     = getCurrentBadge(donations);
  const next        = getNextBadge(donations);
  const earnedCount = BADGES.filter((b) => donations >= b.required).length;

  /* Load all donors from localStorage */
  const donors = getDonors();

  return (
    <div style={{ fontFamily:"Poppins,sans-serif", background:"#f9fafb", minHeight:"100vh", paddingTop:100, paddingBottom:60 }}>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 5%" }}>

        {/* ── Page header banner ── */}
        <div style={{ background:"linear-gradient(135deg,#be123c,#881337)", borderRadius:28, padding:"36px 40px", marginBottom:24, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div style={{ position:"absolute", width:240, height:240, borderRadius:"50%", border:"48px solid rgba(255,255,255,.07)", right:-40, bottom:-60 }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <p style={{ color:"rgba(255,255,255,.7)", fontSize:13, marginBottom:4 }}>🏅 Achievement Center</p>
            <h1 style={{ color:"white", fontSize:26, fontWeight:800, marginBottom:4 }}>My Donor Badges</h1>
            <p style={{ color:"rgba(255,255,255,.65)", fontSize:13 }}>
              {user?.name} · {donations} donation{donations !== 1 ? "s" : ""} · {earnedCount} of {BADGES.length} badges earned
            </p>
          </div>
          <button onClick={() => navigate("/donors/add")}
            style={{ padding:"12px 24px", borderRadius:14, background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.3)", color:"white", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Poppins,sans-serif", backdropFilter:"blur(8px)", position:"relative", zIndex:1 }}>
            🩸 Donate to Earn
          </button>
        </div>

        {/* ── 24hr update notice ── */}
        <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:14, padding:"11px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:16 }}>⏱️</span>
          <p style={{ fontSize:13, color:"#92400e", fontWeight:500, margin:0 }}>
            Your badge will be updated within <strong>24 hours</strong> of a successful donation being confirmed.
          </p>
        </div>

        {/* ── Current badge + next badge progress ── */}
        <div style={{ background:"white", borderRadius:22, padding:"24px 28px", marginBottom:24, border:"1px solid #f3f4f6", boxShadow:"0 1px 4px rgba(0,0,0,.05)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Current */}
          <div style={{ background: current ? current.bg : "#f9fafb", borderRadius:16, padding:"20px", border:`1.5px solid ${current ? current.border : "#e5e7eb"}` }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Current Badge</p>
            {current ? (
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:32 }}>{current.icon}</div>
                <div>
                  <p style={{ fontSize:16, fontWeight:800, color:"#111827", marginBottom:2 }}>{current.name}</p>
                  <p style={{ fontSize:12, color:current.color, fontWeight:600 }}>{current.meaning}</p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize:13, color:"#9ca3af" }}>No badge yet — make your first donation!</p>
            )}
          </div>

          {/* Next + progress bar */}
          <div style={{ background:"#f9fafb", borderRadius:16, padding:"20px", border:"1.5px solid #f3f4f6" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Next Badge</p>
            {next ? (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ fontSize:24 }}>🔒</div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:1 }}>{next.name}</p>
                    <p style={{ fontSize:12, color:"#9ca3af" }}>{next.required - donations} more donation{next.required - donations !== 1 ? "s" : ""} needed</p>
                  </div>
                </div>
                <div style={{ background:"#e5e7eb", borderRadius:100, height:8, overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:100, background:"linear-gradient(90deg,#f43f5e,#be123c)", width:`${Math.min((donations/next.required)*100,100)}%`, transition:"width .5s" }} />
                </div>
                <p style={{ fontSize:11, color:"#9ca3af", marginTop:6, textAlign:"right" }}>{donations} / {next.required}</p>
              </>
            ) : (
              <p style={{ fontSize:13, color:"#22c55e", fontWeight:600 }}>🎉 All badges earned!</p>
            )}
          </div>
        </div>

        {/* ── My badge list ── */}
        <div style={{ background:"white", borderRadius:22, border:"1px solid #f3f4f6", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.05)", marginBottom:28 }}>
          {/* Header */}
          <div style={{ background:"#f9fafb", padding:"12px 24px", borderBottom:"1px solid #f3f4f6", display:"grid", gridTemplateColumns:"52px 1fr 120px 100px", gap:16 }}>
            {["Icon","Badge","Required","Status"].map((h) => (
              <div key={h} style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".08em" }}>{h}</div>
            ))}
          </div>

          {BADGES.map((b, i) => {
            const earned = donations >= b.required;
            return (
              <div key={b.id}
                style={{ padding:"18px 24px", borderBottom: i < BADGES.length-1 ? "1px solid #f9fafb" : "none", display:"grid", gridTemplateColumns:"52px 1fr 120px 100px", gap:16, alignItems:"center", background: earned ? "white" : "#fafafa", transition:"background .2s", cursor:"default" }}
                onMouseEnter={(e) => e.currentTarget.style.background = earned ? "#fff8f8" : "#f5f5f5"}
                onMouseLeave={(e) => e.currentTarget.style.background = earned ? "white" : "#fafafa"}
              >
                <div style={{ width:44, height:44, borderRadius:14, background: earned ? b.bg : "#e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, opacity: earned ? 1 : 0.5 }}>
                  {earned ? b.icon : "🔒"}
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color: earned ? "#111827" : "#9ca3af" }}>{b.name}</span>
                    <span style={{ fontSize:10, fontWeight:600, color: earned ? b.color : "#9ca3af" }}>{b.meaning}</span>
                  </div>
                  <p style={{ fontSize:12, color: earned ? "#6b7280" : "#d1d5db", lineHeight:1.5, margin:0 }}>
                    {earned ? b.reason : `Donate ${b.required} times to unlock.`}
                  </p>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color: earned ? "#374151" : "#9ca3af" }}>
                  {b.required} donation{b.required !== 1 ? "s" : ""}
                </div>
                <span style={{ fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:100, background: earned ? b.bg : "#f3f4f6", color: earned ? b.color : "#9ca3af", border:`1px solid ${earned ? b.border : "#e5e7eb"}`, display:"inline-block" }}>
                  {earned ? "✓ Earned" : "Locked"}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Community Donors Badges section ── */}
        <div style={{ background:"white", borderRadius:22, border:"1px solid #f3f4f6", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.05)", marginBottom:16 }}>

          {/* Section header */}
          <div style={{ padding:"20px 24px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <h2 style={{ fontSize:16, fontWeight:700, color:"#111827", marginBottom:2 }}>👥 Community Donor Badges</h2>
              <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Badges earned by registered donors in the registry</p>
            </div>
            <button onClick={() => navigate("/donors")}
              style={{ fontSize:12, fontWeight:600, color:"#e11d48", background:"none", border:"none", cursor:"pointer", fontFamily:"Poppins,sans-serif" }}>
              View All Donors →
            </button>
          </div>

          {/* Donor rows */}
          {donors.map((d, i) => {
            const donorBadge = getCurrentBadge(d.count || 0);
            const initials   = d.initials || d.name?.split(" ").map((w) => w[0]).join("").slice(0,2).toUpperCase() || "?";
            return (
              <div key={d.id}
                style={{ padding:"14px 24px", borderBottom: i < donors.length-1 ? "1px solid #f9fafb" : "none", display:"flex", alignItems:"center", gap:14, transition:"background .2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background="#fff8f8"}
                onMouseLeave={(e) => e.currentTarget.style.background="white"}
              >
                {/* Avatar */}
                <div style={{ width:40, height:40, borderRadius:"50%", background: d.bg || GRAD_COLORS[i % GRAD_COLORS.length], display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:13, flexShrink:0 }}>
                  {initials}
                </div>

                {/* Name + blood */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{d.name}</span>
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:100, background:"#fff1f2", color:"#e11d48" }}>{d.blood}</span>
                  </div>
                  <p style={{ fontSize:12, color:"#9ca3af", margin:0, marginTop:1 }}>
                    {d.count || 0} donation{(d.count || 0) !== 1 ? "s" : ""} · {d.location}
                  </p>
                </div>

                {/* Badge earned */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  {donorBadge ? (
                    <div style={{ display:"flex", alignItems:"center", gap:6, background: donorBadge.bg, border:`1px solid ${donorBadge.border}`, borderRadius:100, padding:"4px 12px" }}>
                      <span style={{ fontSize:14 }}>{donorBadge.icon}</span>
                      <span style={{ fontSize:12, fontWeight:700, color: donorBadge.color }}>{donorBadge.name}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize:12, color:"#d1d5db", fontWeight:500 }}>No badge yet</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer note ── */}
        <div style={{ padding:"12px 20px", background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:14, textAlign:"center" }}>
          <p style={{ fontSize:12, color:"#9f1239", margin:0 }}>
            💡 Badges update automatically within 24 hours of a confirmed donation after backend integration.
          </p>
        </div>

      </div>
    </div>
  );
}