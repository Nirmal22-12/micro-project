import { useNavigate } from "react-router-dom";

/**
 * HeroSection — full-width gradient hero used on the Home page.
 * Props allow customisation without rebuilding the markup.
 */
export default function HeroSection({
  badge = "4.2 million lives saved this year",
  headline = ["Every Drop of", "Your Blood", "Saves a Life"],
  highlightLine = 1,          // which line index gets the gradient treatment
  subtext = "Join the nation's most trusted blood donation network.",
  primaryCta = { label: "Register to Donate →", to: "/donors/add" },
  secondaryCta = { label: "View Dashboard", to: "/dashboard" },
  stats = [
    { value: "120K+", label: "Active Donors" },
    { value: "340+",  label: "Donation Centers" },
    { value: "98%",   label: "Match Rate" },
  ],
}) {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen relative overflow-hidden flex items-center px-[5%] pt-[100px] pb-16"
      style={{
        background:
          "linear-gradient(135deg,#1a0408 0%,#4a0010 25%,#8b0000 50%,#c0152a 75%,#e11d48 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] -top-[200px] -right-[100px] rounded-full" style={{ background: "rgba(255,255,255,.03)" }} />
        <div className="absolute w-[400px] h-[400px] -bottom-[100px] -left-[100px] rounded-full" style={{ background: "rgba(255,255,255,.03)" }} />
        <div className="absolute w-[200px] h-[200px] top-1/3 left-[40%] rounded-full" style={{ background: "rgba(255,255,255,.05)" }} />
      </div>

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium mb-6 text-white/90"
            style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", backdropFilter: "blur(8px)" }}
          >
            <span
              className="w-2 h-2 rounded-full bg-red-400"
              style={{ animation: "pulseRing 2s infinite" }}
            />
            {badge}
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] text-white mb-5">
            {headline.map((line, i) =>
              i === highlightLine ? (
                <span
                  key={i}
                  style={{
                    background: "linear-gradient(90deg,#ff8a95,#ffd4d8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {line}
                  <br />
                </span>
              ) : (
                <span key={i}>
                  {line}
                  <br />
                </span>
              )
            )}
          </h1>

          <p className="text-white/70 text-base leading-7 mb-9 max-w-lg">{subtext}</p>

          {/* CTAs */}
          <div className="flex gap-3.5 flex-wrap mb-10">
            <button
              onClick={() => navigate(primaryCta.to)}
              className="px-7 py-3.5 rounded-2xl bg-white text-red-700 font-bold text-sm cursor-pointer border-none transition-all hover:-translate-y-0.5 font-[inherit]"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}
            >
              {primaryCta.label}
            </button>
            <button
              onClick={() => navigate(secondaryCta.to)}
              className="px-7 py-3.5 rounded-2xl text-white font-semibold text-sm cursor-pointer transition-all hover:bg-white/20 font-[inherit]"
              style={{ background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.3)", backdropFilter: "blur(8px)" }}
            >
              {secondaryCta.label}
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 flex-wrap">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-[1.8rem] font-extrabold text-white leading-none">{value}</div>
                <div className="text-xs text-white/60 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Illustration slot */}
        <div
          className="hidden md:flex items-center justify-center relative"
          style={{ animation: "float 5s ease-in-out infinite" }}
        >
          <svg viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[480px]">
            <defs>
              <radialGradient id="hg" cx="40%" cy="30%">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#8b0000" />
              </radialGradient>
              <filter id="hglow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle cx="200" cy="220" r="140" fill="none" stroke="rgba(255,100,100,0.12)" strokeWidth="60" />
            <circle cx="200" cy="220" r="100" fill="none" stroke="rgba(255,100,100,0.08)" strokeWidth="40" />
            <path d="M200 60C200 60 120 160 120 230C120 275 156 310 200 310C244 310 280 275 280 230C280 160 200 60 200 60Z" fill="url(#hg)" filter="url(#hglow)" />
            <ellipse cx="175" cy="190" rx="18" ry="30" fill="rgba(255,255,255,0.25)" transform="rotate(-20,175,190)" />
            <rect x="188" y="245" width="24" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
            <rect x="196" y="237" width="8" height="24" rx="4" fill="rgba(255,255,255,0.6)" />
            <path d="M60 370L110 370L125 345L140 395L155 360L175 370L185 355L195 385L210 370L340 370" fill="none" stroke="rgba(255,150,150,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Floating info cards */}
          <div
            className="absolute top-[8%] right-0 p-3.5 rounded-2xl text-white text-xs"
            style={{ background: "rgba(255,255,255,.12)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.2)" }}
          >
            <div className="text-base mb-1">🩸</div>
            <div className="font-semibold">O+ Available</div>
            <div className="text-white/65">3 units · 2 km away</div>
          </div>
          <div
            className="absolute bottom-[18%] left-0 p-3.5 rounded-2xl text-white text-xs"
            style={{ background: "rgba(255,255,255,.12)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.2)" }}
          >
            <div className="text-base mb-1">✅</div>
            <div className="font-semibold">Just Donated</div>
            <div className="text-white/65">Rahul M. · AB+ · Today</div>
          </div>
        </div>
      </div>
    </section>
  );
}
