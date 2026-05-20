import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CampaignCard from "../components/CampaignCard";

const CAMPAIGNS = [
  { id:1, type:"Whole Blood", urgencyLabel:"🔴 Urgent", urgencyColor:"#dc2626", location:"Silchar Medical College", title:"Emergency Blood Drive — O- Critical Shortage", date:"Apr 5, 2026", time:"9:00–17:00", current:180, goal:250 },
  { id:2, type:"Platelets", urgencyLabel:"⚠️ Soon", urgencyColor:"#f97316", location:"Cachar Cancer Hospital", title:"Platelet Donation Camp — Cancer Ward Support", date:"Apr 8, 2026", time:"8:00–14:00", current:45, goal:100 },
  { id:3, type:"Plasma", urgencyLabel:"Open", urgencyColor:"#16a34a", location:"Assam Univ Med Center", title:"Community Plasma Drive — All Blood Types Welcome", date:"Apr 12, 2026", time:"10:00–18:00", current:84, goal:300 },
];

const FEATURES = [
  { icon:"❤️", color:"#fff1f2", title:"Why Donate Blood?", desc:"One donation can save up to 3 lives. Blood cannot be manufactured — only donated. Every 2 seconds someone needs blood.", link:"/why-donate", cta:"Learn more" },
  { icon:"📍", color:"#fff0f3", title:"Find a Donation Center", desc:"Locate 340+ certified blood banks and donation drives near you. Book appointments in real-time with live slot availability.", link:"/donors", cta:"Find centers" },
  { icon:"📋", color:"#fff7ed", title:"Donation Guidelines", desc:"Understand eligibility criteria, preparation tips, and post-donation care. Our AI eligibility checker guides you step by step.", link:"/donors/add", cta:"Check eligibility" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const goDonate = () => navigate(user ? "/donors/add" : "/login");

  return (
    <div className="page-home">
      {/* ── Hero ── */}
      <section className="min-h-screen relative overflow-hidden flex items-center px-[5%] pt-[100px] pb-16"
        style={{ background: "linear-gradient(135deg,#1a0408 0%,#4a0010 25%,#8b0000 50%,#c0152a 75%,#e11d48 100%)" }}>
        {/* BG circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] top-[-200px] right-[-100px] rounded-full" style={{ background:"rgba(255,255,255,.03)" }} />
          <div className="absolute w-[400px] h-[400px] bottom-[-100px] left-[-100px] rounded-full" style={{ background:"rgba(255,255,255,.03)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-[1400px] mx-auto w-full">
          {/* Text */}
          <div style={{ animation:"fadeInUp .6s ease forwards" }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium mb-6 text-white/90"
              style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", backdropFilter:"blur(8px)" }}>
              <div className="w-2 h-2 rounded-full bg-red-400" style={{ animation:"pulseRing 2s infinite" }} />
              4.2 million lives saved this year
            </div>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] text-white mb-5">
              Every Drop of<br />
              <span style={{ background:"linear-gradient(90deg,#ff8a95,#ffd4d8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Your Blood
              </span><br />
              Saves a Life
            </h1>
            <p className="text-white/70 text-base leading-7 mb-9 font-normal max-w-lg">
              Join the nation's most trusted blood donation network. Connect with donation centers, track your impact, and be someone's miracle today.
            </p>
            <div className="flex gap-3.5 flex-wrap mb-10">
              <button onClick={goDonate}
                className="px-7 py-3.5 rounded-2xl bg-white text-red-700 font-bold text-sm cursor-pointer border-none transition-all duration-200 hover:-translate-y-0.5"
                style={{ boxShadow:"0 4px 20px rgba(0,0,0,.2)" }}>
                Register to Donate →
              </button>
              <button onClick={() => navigate("/dashboard")}
                className="px-7 py-3.5 rounded-2xl text-white font-semibold text-sm cursor-pointer transition-all duration-200 hover:bg-white/20"
                style={{ background:"rgba(255,255,255,.12)", border:"1.5px solid rgba(255,255,255,.3)", backdropFilter:"blur(8px)" }}>
                View Dashboard
              </button>
            </div>
            <div className="flex gap-8">
              {[["120K+","Active Donors"],["340+","Donation Centers"],["98%","Match Rate"]].map(([n,l]) => (
                <div key={l}>
                  <div className="text-[1.8rem] font-extrabold text-white leading-none">{n}</div>
                  <div className="text-xs text-white/60 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden md:flex items-center justify-center relative" style={{ animation:"float 5s ease-in-out infinite" }}>
            <svg viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[480px]">
              <defs>
                <radialGradient id="dropGrad" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="#ff6b6b"/>
                  <stop offset="100%" stopColor="#8b0000"/>
                </radialGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <circle cx="200" cy="220" r="140" fill="none" stroke="rgba(255,100,100,0.12)" strokeWidth="60"/>
              <circle cx="200" cy="220" r="100" fill="none" stroke="rgba(255,100,100,0.08)" strokeWidth="40"/>
              <path d="M200 60C200 60 120 160 120 230C120 275 156 310 200 310C244 310 280 275 280 230C280 160 200 60 200 60Z" fill="url(#dropGrad)" filter="url(#glow)"/>
              <ellipse cx="175" cy="190" rx="18" ry="30" fill="rgba(255,255,255,0.25)" transform="rotate(-20,175,190)"/>
              <rect x="188" y="245" width="24" height="8" rx="4" fill="rgba(255,255,255,0.6)"/>
              <rect x="196" y="237" width="8" height="24" rx="4" fill="rgba(255,255,255,0.6)"/>
              <circle cx="310" cy="150" r="8" fill="rgba(255,150,150,0.4)"/>
              <circle cx="80" cy="180" r="6" fill="rgba(255,120,120,0.3)"/>
              <path d="M60 370L110 370L125 345L140 395L155 360L175 370L185 355L195 385L210 370L340 370" fill="none" stroke="rgba(255,150,150,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Floating cards */}
            <div className="absolute top-[8%] right-0 p-3.5 rounded-2xl text-white text-xs"
              style={{ background:"rgba(255,255,255,.12)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,.2)" }}>
              <div className="text-base mb-1">🩸</div>
              <div className="font-semibold">O+ Available</div>
              <div className="text-white/65">3 units · 2km away</div>
            </div>
            <div className="absolute bottom-[18%] left-0 p-3.5 rounded-2xl text-white text-xs"
              style={{ background:"rgba(255,255,255,.12)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,.2)" }}>
              <div className="text-base mb-1">✅</div>
              <div className="font-semibold">Just Donated</div>
              <div className="text-white/65">Rahul M. · AB+ · Today</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-[5%]">
        <div className="mb-14">
          <div className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wide mb-4">Why LifeFlow?</div>
          <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-gray-900 mb-3">Everything You Need to<br/>Save a Life Today</h2>
          <p className="text-gray-400 text-base leading-7 max-w-lg">From finding the nearest donation center to tracking your donation history — we make it simple.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} onClick={() => navigate(f.link)}
              className="bg-white border border-gray-100 rounded-3xl p-9 cursor-pointer group relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
              style={{ boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow="0 10px 40px rgba(0,0,0,.12)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.05)"}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background:"linear-gradient(135deg,#fff1f2,transparent)" }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10" style={{ background: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2.5 relative z-10">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-7 relative z-10">{f.desc}</p>
              <div className="mt-6 text-red-400 font-semibold text-sm flex items-center gap-1.5 relative z-10 group-hover:text-red-600 group-hover:gap-2.5 transition-all">
                {f.cta} →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Campaigns ── */}
      <section className="py-24 px-[5%]" style={{ background:"linear-gradient(180deg,#f9fafb 0%,white 100%)" }}>
        <div className="mb-14">
          <div className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wide mb-4">Active Campaigns</div>
          <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-gray-900 mb-3">Donation Drives Near You</h2>
          <p className="text-gray-400 text-base leading-7 max-w-lg">Join one of our active campaigns and make a direct impact in your community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAMPAIGNS.map((c, i) => <CampaignCard key={c.id} campaign={c} index={i} />)}
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-24 px-[5%] text-center relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#9f1239,#e11d48,#be123c)" }}>
        <div className="absolute w-[500px] h-[500px] rounded-full -top-[150px] -left-[100px]" style={{ border:"100px solid rgba(255,255,255,.04)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full -bottom-[150px] -right-[100px]" style={{ border:"80px solid rgba(255,255,255,.04)" }} />
        <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold text-white mb-4 relative z-10">Together, We Can Save Lives</h2>
        <p className="text-white/75 text-base mb-10 relative z-10 max-w-lg mx-auto">Join over 120,000 active donors across the nation. Your 30-minute donation could be someone's second chance at life.</p>
        <button onClick={goDonate}
          className="inline-flex items-center gap-2.5 px-9 py-4 bg-white text-red-700 rounded-2xl font-bold text-base cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] relative z-10"
          style={{ boxShadow:"0 8px 32px rgba(0,0,0,.25)" }}>
          ❤️ Start Your Journey Today
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white px-[5%] pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#e11d48,#9f1239)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
              </div>
              <span className="text-lg font-bold">Life<span className="font-light opacity-70">Flow</span></span>
            </div>
            <p className="text-white/50 text-sm leading-7 max-w-[280px]">India's most trusted blood donation platform connecting donors, recipients, and hospitals since 2019.</p>
          </div>
          {[["Platform",["Home","Dashboard","Donors","Register"]],["Resources",["Eligibility Guide","Blood Types","FAQ","Contact"]],["Legal",["Privacy Policy","Terms of Use","Accessibility"]]].map(([title,links]) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">{title}</p>
              <div className="flex flex-col gap-2.5">
                {links.map(l => <span key={l} className="text-white/65 text-sm cursor-pointer hover:text-white transition-colors">{l}</span>)}
              </div>
            </div>
          ))}
        </div>
        <hr className="border-white/10 mb-7" />
        <div className="flex justify-between items-center text-white/40 text-xs flex-wrap gap-4">
          <span>© 2026 LifeFlow. All rights reserved.</span>
          <span>Made with ❤️ to save lives</span>
        </div>
      </footer>
    </div>
  );
}
