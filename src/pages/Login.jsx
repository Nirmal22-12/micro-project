import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseInput = {
  width:"100%",
  padding:"12px 16px",
  borderRadius:12,
  fontSize:14,
  fontFamily:"Poppins, sans-serif",
  color:"#1f2937",
  background:"#fff",
  outline:"none",
  transition:"border-color .2s, box-shadow .2s",
};

export default function Login() {
  const { login, handleGoogleAuth }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname || "/dashboard";
  const fromDonate   = location.state?.from?.pathname === "/donors/add";

  const [form, setForm]       = useState({ email:"", password:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState("");

  const handle = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const borderColor = (key) => focused === key ? "#e11d48" : "#e5e7eb";
  const boxShadow   = (key) => focused === key ? "0 0 0 3px rgba(225,29,72,.1)" : "none";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in both fields."); return; }
    setLoading(true);

    try {
      await login({ email: form.email, password: form.password });
      setLoading(false);
      navigate(from, { replace:true });
    } catch (err) {
      setLoading(false);
      setError(err.message || "Invalid credentials provided.");
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"Poppins,sans-serif" }}>

      {/* ── Left branding panel ── */}
     <div className="hidden lg:flex flex-col justify-between w-[45%] pt-[86px] px-14 pb-14 relative overflow-hidden"
         style={{ background:"linear-gradient(145deg,#1a0408 0%,#6b000e 45%,#c0152a 100%)" }}>
        <div className="absolute w-[500px] h-[500px] rounded-full -top-32 -right-32"
          style={{ border:"80px solid rgba(255,255,255,.04)" }} />
        <div className="absolute w-[300px] h-[300px] rounded-full -bottom-16 -left-16"
          style={{ border:"60px solid rgba(255,255,255,.04)" }} />

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative", zIndex:1 }}>
          <div style={{ width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.2)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span style={{ color:"white", fontSize:20, fontWeight:700 }}>
            Hemo<span style={{ fontWeight:300, opacity:.75 }}>Life</span>
          </span>
        </div>

        {/* Illustration + copy */}
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ marginBottom:32 }}>
            <svg viewBox="0 0 280 300" style={{ width:180, opacity:.9 }}>
              <defs>
                <radialGradient id="lg1" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="#ff6b6b"/>
                  <stop offset="100%" stopColor="#8b0000"/>
                </radialGradient>
                <filter id="lglow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <circle cx="140" cy="160" r="100" fill="none" stroke="rgba(255,100,100,.1)" strokeWidth="50"/>
              <path d="M140 40C140 40 75 115 75 165C75 200 104 225 140 225C176 225 205 200 205 165C205 115 140 40 140 40Z" fill="url(#lg1)" filter="url(#lglow)"/>
              <ellipse cx="118" cy="135" rx="13" ry="22" fill="rgba(255,255,255,.22)" transform="rotate(-20,118,135)"/>
              <rect x="131" y="178" width="18" height="6" rx="3" fill="rgba(255,255,255,.55)"/>
              <rect x="137" y="172" width="6" height="18" rx="3" fill="rgba(255,255,255,.55)"/>
            </svg>
          </div>
          <h2 style={{ color:"white", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:800, lineHeight:1.2, marginBottom:16 }}>
            Every Drop<br/>Counts.
          </h2>
          <p style={{ color:"rgba(255,255,255,.65)", fontSize:14, lineHeight:1.7, maxWidth:280 }}>
            Join 120,000+ active donors saving lives across India.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:32, position:"relative", zIndex:1 }}>
          {[["120K+","Donors"],["340+","Centers"],["4.2M","Lives Saved"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ color:"white", fontWeight:800, fontSize:20 }}>{n}</div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:11, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 24px 48px", background:"#fafafa" }}>
        <div style={{ width:"100%", maxWidth:420 }}>



          <h1 style={{ fontSize:26, fontWeight:800, color:"#111827", marginBottom:4 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:"#9ca3af", marginBottom:24 }}>Sign in to your HemoLife account</p>

          {/* Redirected from donate */}
          {fromDonate && (
            <div style={{ marginBottom:16, padding:"12px 14px", borderRadius:12, background:"#fff1f2", border:"1px solid #fecdd3", display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:16 }}>🩸</span>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"#be123c", marginBottom:2 }}>Login required to donate</p>
                <p style={{ fontSize:12, color:"#e11d48" }}>Sign in or create a free account to register as a donor.</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginBottom:16, padding:"12px 14px", borderRadius:12, background:"#fee2e2", border:"1px solid #fca5a5", color:"#991b1b", fontSize:13, fontWeight:500, display:"flex", gap:8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Email */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151" }}>
                Email Address <span style={{ color:"#e11d48" }}>*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handle("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={{ ...baseInput, border:`1.5px solid ${borderColor("email")}`, boxShadow:boxShadow("email") }}
              />
            </div>

            {/* Password */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#374151" }}>
                  Password <span style={{ color:"#e11d48" }}>*</span>
                </label>
                <span style={{ fontSize:12, color:"#e11d48", fontWeight:500, cursor:"pointer" }}>Forgot password?</span>
              </div>
              <div style={{ position:"relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handle("password")}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  style={{ ...baseInput, border:`1.5px solid ${borderColor("password")}`, boxShadow:boxShadow("password"), paddingRight:44 }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, lineHeight:1, color:"#9ca3af" }}>
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <input type="checkbox" style={{ width:15, height:15, accentColor:"#e11d48", cursor:"pointer" }} />
              <span style={{ fontSize:13, color:"#4b5563" }}>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                padding:"14px", borderRadius:14, border:"none",
                cursor: loading ? "not-allowed" : "pointer",
                background:"linear-gradient(135deg,#f43f5e,#be123c)",
                color:"white", fontSize:14, fontWeight:700,
                fontFamily:"Poppins,sans-serif",
                boxShadow:"0 8px 28px rgba(193,21,42,.3)",
                opacity: loading ? .6 : 1,
                transition:"all .2s",
              }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
            <div style={{ flex:1, height:1, background:"#e5e7eb" }} />
            <span style={{ fontSize:12, color:"#9ca3af", fontWeight:500 }}>or</span>
            <div style={{ flex:1, height:1, background:"#e5e7eb" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setLoading(true);
                try {
                  await handleGoogleAuth(credentialResponse.credential);
                  setLoading(false);
                  navigate(from, { replace: true });
                } catch (err) {
                  setLoading(false);
                  setError("Google authentication failed. Please try again.");
                }
              }}
              onError={() => setError("Google authentication failed. Please try again.")}
              useOneTap
              shape="pill"
              theme="outline"
              size="large"
            />
          </div>

          <p style={{ textAlign:"center", fontSize:13, color:"#9ca3af" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color:"#e11d48", fontWeight:700, textDecoration:"none" }}>Create one free →</Link>
          </p>
          <p style={{ textAlign:"center", marginTop:12 }}>
            <Link to="/" style={{ fontSize:12, color:"#9ca3af", textDecoration:"none" }}>← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
