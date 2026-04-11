import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const REASONS = [
  {
    icon: "🩸",
    color: "#fff1f2",
    accent: "#e11d48",
    title: "One Donation Saves Up to 3 Lives",
    desc: "When you donate blood, it is separated into red cells, platelets, and plasma — each used for a different patient. A single 30-minute session at a donation center can directly save up to three lives in one go.",
  },
  {
    icon: "🏭",
    color: "#fff7ed",
    accent: "#f97316",
    title: "Blood Cannot Be Manufactured",
    desc: "Despite decades of research, there is no artificial substitute for human blood. It cannot be grown in a lab or factory. The only source is voluntary human donation. Without donors, hospitals simply run out.",
  },
  {
    icon: "⏱️",
    color: "#eff6ff",
    accent: "#3b82f6",
    title: "Someone Needs Blood Every 2 Seconds",
    desc: "Across India, a patient requires blood transfusion every two seconds. Accident victims, cancer patients undergoing chemotherapy, mothers during childbirth, and surgery patients all depend on a steady supply.",
  },
  {
    icon: "♻️",
    color: "#f0fdf4",
    accent: "#22c55e",
    title: "Your Body Replenishes It Fully",
    desc: "Your body replaces donated plasma within 24 hours. Red blood cells are fully replenished within 4–6 weeks. Donation is completely safe and your body recovers quickly with no lasting impact on your health.",
  },
  {
    icon: "❤️",
    color: "#fdf4ff",
    accent: "#a855f7",
    title: "It Is Good for Your Own Health Too",
    desc: "Regular blood donation stimulates the production of new blood cells, keeping your cardiovascular system healthy. Donors receive a free mini health check — blood pressure, hemoglobin, and pulse — every time they donate.",
  },
  {
    icon: "🆘",
    color: "#fff1f2",
    accent: "#dc2626",
    title: "Emergency Shortages Happen Every Day",
    desc: "Rare blood types like O- and AB- are always critically short. During natural disasters, accidents, or disease outbreaks, demand spikes suddenly. A stocked blood bank is the difference between life and death for emergency patients.",
  },
  {
    icon: "👶",
    color: "#fefce8",
    accent: "#eab308",
    title: "Newborns and Children Depend on It",
    desc: "Premature babies often need multiple transfusions to survive. Children with sickle cell disease require regular blood to live normal lives. Thalassemia patients need transfusions every 2–3 weeks throughout their entire lives.",
  },
  {
    icon: "🔬",
    color: "#f0fdf4",
    accent: "#16a34a",
    title: "Cancer Patients Need It to Survive Treatment",
    desc: "Chemotherapy destroys blood cells along with cancer cells. Most cancer patients require frequent blood and platelet transfusions throughout their treatment. Without a reliable donor supply, many cancer treatments simply cannot proceed.",
  },
];

const FACTS = [
  { number: "38%", label: "of the population is eligible to donate but only 6.8% actually do" },
  { number: "120 days", label: "is how long a single unit of donated red blood cells can be stored" },
  { number: "1 unit", label: "of whole blood can be separated into 3 life-saving components" },
  { number: "56 days", label: "minimum gap between whole blood donations — healthy and safe" },
];

const TYPES = [
  { type: "Whole Blood", time: "8–10 min", freq: "Every 56 days", icon: "🩸", desc: "The most common type. Easiest to donate. Used in surgeries and trauma cases." },
  { type: "Platelets", time: "~90 min", freq: "Every 7 days", icon: "🔴", desc: "Critical for cancer and surgery patients. Expires within just 5 days of donation." },
  { type: "Plasma", time: "~40 min", freq: "Every 28 days", icon: "💛", desc: "Used for burn victims, shock patients, and those with clotting disorders." },
  { type: "Double Red", time: "~30 min", freq: "Every 112 days", icon: "❤️", desc: "Donates twice the red cells in one session. Ideal for O- and B- donors." },
];

export default function WhyDonate() {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const goDonate  = () => navigate(user ? "/donors/add" : "/login");

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg,#1a0408 0%,#6b000e 45%,#c0152a 100%)",
        padding: "140px 5% 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative rings */}
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", border:"80px solid rgba(255,255,255,.04)", top:-150, right:-100 }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", border:"60px solid rgba(255,255,255,.04)", bottom:-80, left:-80 }} />

        {/* ECG line */}
        <div style={{ position:"absolute", bottom:32, left:0, right:0, opacity:.2 }}>
          <svg viewBox="0 0 1200 60" style={{ width:"100%" }}>
            <path d="M0 30 L200 30 L240 30 L260 5 L280 55 L300 20 L320 30 L500 30 L540 30 L560 2 L580 58 L600 15 L620 30 L900 30 L940 30 L960 8 L980 52 L1000 22 L1020 30 L1200 30"
              fill="none" stroke="rgba(255,150,150,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ maxWidth:760, position:"relative", zIndex:1 }}>
          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", borderRadius:100, padding:"6px 16px", marginBottom:24 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#ff6b6b" }} />
            <span style={{ color:"rgba(255,255,255,.9)", fontSize:12, fontWeight:500 }}>Why Your Blood Matters</span>
          </div>

          <h1 style={{ color:"white", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:20 }}>
            Why Donate Blood?<br/>
            <span style={{ background:"linear-gradient(90deg,#ff8a95,#ffd4d8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Because No Machine Can.
            </span>
          </h1>
          <p style={{ color:"rgba(255,255,255,.7)", fontSize:16, lineHeight:1.8, maxWidth:580, marginBottom:36 }}>
            Blood is irreplaceable. No factory produces it, no algorithm synthesizes it. 
            Every drop in a hospital came from a human being who chose to give. Here is why that choice matters.
          </p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <button onClick={goDonate}
              style={{ padding:"14px 30px", borderRadius:14, background:"white", color:"#be123c", fontWeight:700, fontSize:14, border:"none", cursor:"pointer", fontFamily:"Poppins,sans-serif", boxShadow:"0 4px 20px rgba(0,0,0,.2)" }}>
              Donate Now →
            </button>
            <button onClick={() => navigate("/donors")}
              style={{ padding:"14px 30px", borderRadius:14, background:"rgba(255,255,255,.12)", color:"white", fontWeight:600, fontSize:14, border:"1.5px solid rgba(255,255,255,.3)", cursor:"pointer", fontFamily:"Poppins,sans-serif", backdropFilter:"blur(8px)" }}>
              View Donor Registry
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Facts Strip ── */}
      <div style={{ background:"#fff1f2", borderBottom:"1px solid #fecdd3", padding:"32px 5%" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:24, maxWidth:1200, margin:"0 auto" }}>
          {FACTS.map((f) => (
            <div key={f.number} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"clamp(1.6rem,3vw,2.2rem)", fontWeight:800, color:"#e11d48", marginBottom:6 }}>{f.number}</div>
              <div style={{ fontSize:13, color:"#9f1239", lineHeight:1.5 }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8 Reasons ── */}
      <div style={{ padding:"80px 5%", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ display:"inline-block", background:"#fff1f2", color:"#e11d48", fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:100, letterSpacing:".06em", textTransform:"uppercase", marginBottom:14 }}>
            8 Powerful Reasons
          </div>
          <h2 style={{ fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:800, color:"#111827", marginBottom:12, lineHeight:1.2 }}>
            Every Reason to Give
          </h2>
          <p style={{ color:"#9ca3af", fontSize:15, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
            Whether it is your first time or your fiftieth, here is what your donation means to the people waiting for it.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
          {REASONS.map((r, i) => (
            <div key={r.title}
              style={{ background:"white", border:"1px solid #f3f4f6", borderRadius:24, padding:"32px 28px", position:"relative", overflow:"hidden", transition:"all .3s", cursor:"default" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,.12)"; e.currentTarget.style.borderColor=r.accent+"44"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="#f3f4f6"; }}
            >
              {/* Number watermark */}
              <div style={{ position:"absolute", top:16, right:20, fontSize:48, fontWeight:800, color:"#f3f4f6", lineHeight:1, userSelect:"none" }}>
                {String(i+1).padStart(2,"0")}
              </div>

              {/* Icon */}
              <div style={{ width:52, height:52, borderRadius:16, background:r.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:20 }}>
                {r.icon}
              </div>

              {/* Accent bar */}
              <div style={{ width:36, height:4, borderRadius:100, background:r.accent, marginBottom:14 }} />

              <h3 style={{ fontSize:16, fontWeight:700, color:"#111827", marginBottom:10, lineHeight:1.3 }}>{r.title}</h3>
              <p style={{ fontSize:14, color:"#6b7280", lineHeight:1.75 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Types of Donation ── */}
      <div style={{ background:"#f9fafb", padding:"80px 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-block", background:"#fff1f2", color:"#e11d48", fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:100, letterSpacing:".06em", textTransform:"uppercase", marginBottom:14 }}>
              What Can You Donate
            </div>
            <h2 style={{ fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:800, color:"#111827", marginBottom:10 }}>
              Types of Blood Donation
            </h2>
            <p style={{ color:"#9ca3af", fontSize:15, maxWidth:480, margin:"0 auto" }}>
              Not all donations are the same. Here is what each type does and how often you can give.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
            {TYPES.map((t) => (
              <div key={t.type}
                style={{ background:"white", borderRadius:22, padding:"28px 24px", border:"1px solid #f3f4f6", transition:"all .3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
              >
                <div style={{ fontSize:32, marginBottom:16 }}>{t.icon}</div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#111827", marginBottom:10 }}>{t.type}</h3>
                <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.7, marginBottom:18 }}>{t.desc}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".05em" }}>Duration</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#e11d48", background:"#fff1f2", padding:"2px 10px", borderRadius:100 }}>{t.time}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".05em" }}>Frequency</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#166534", background:"#dcfce7", padding:"2px 10px", borderRadius:100 }}>{t.freq}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Myths vs Facts ── */}
      <div style={{ padding:"80px 5%", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ display:"inline-block", background:"#fff1f2", color:"#e11d48", fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:100, letterSpacing:".06em", textTransform:"uppercase", marginBottom:14 }}>
            Common Myths
          </div>
          <h2 style={{ fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:800, color:"#111827", marginBottom:10 }}>
            Myths vs Reality
          </h2>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { myth:"Donating blood is painful", fact:"You feel a small pinch when the needle goes in. The actual donation is completely painless." },
            { myth:"I will feel weak afterwards", fact:"Most donors feel completely fine immediately. Drinking water and eating a snack is all the recovery you need." },
            { myth:"I donate too rarely to make a difference", fact:"Even one donation can save up to 3 lives. Every single unit matters, especially rare blood types." },
            { myth:"Blood donation takes hours", fact:"The actual blood draw takes 8–10 minutes. Total time at the center including registration is around 45 minutes." },
            { myth:"I cannot donate because I take medicine", fact:"Most common medications do not disqualify you. The eligibility checker will tell you exactly where you stand." },
          ].map(({ myth, fact }) => (
            <div key={myth}
              style={{ background:"white", borderRadius:18, border:"1px solid #f3f4f6", overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 1fr" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.08)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow=""}
            >
              <div style={{ padding:"20px 24px", background:"#fff5f5", borderRight:"1px solid #fecdd3" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#e11d48", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>❌ Myth</div>
                <p style={{ fontSize:14, fontWeight:500, color:"#7f1d1d", lineHeight:1.6 }}>{myth}</p>
              </div>
              <div style={{ padding:"20px 24px", background:"#f0fdf4" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#16a34a", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>✅ Reality</div>
                <p style={{ fontSize:14, color:"#166534", lineHeight:1.6 }}>{fact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div style={{ background:"linear-gradient(135deg,#9f1239,#e11d48,#be123c)", padding:"80px 5%", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", border:"80px solid rgba(255,255,255,.05)", top:-120, left:-100 }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", border:"60px solid rgba(255,255,255,.05)", bottom:-80, right:-60 }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ color:"white", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:800, marginBottom:14 }}>
            Ready to Save a Life?
          </h2>
          <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, marginBottom:36, maxWidth:520, margin:"0 auto 36px" }}>
            You now know why it matters. The next step takes less than an hour and could mean everything to someone waiting right now.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={goDonate}
              style={{ padding:"14px 32px", borderRadius:16, background:"white", color:"#be123c", fontWeight:700, fontSize:15, border:"none", cursor:"pointer", fontFamily:"Poppins,sans-serif", boxShadow:"0 8px 32px rgba(0,0,0,.25)" }}>
              ❤️ Register to Donate
            </button>
            <button onClick={() => navigate("/donors")}
              style={{ padding:"14px 32px", borderRadius:16, background:"rgba(255,255,255,.15)", color:"white", fontWeight:600, fontSize:15, border:"1.5px solid rgba(255,255,255,.3)", cursor:"pointer", fontFamily:"Poppins,sans-serif", backdropFilter:"blur(8px)" }}>
              View Donor Registry
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}