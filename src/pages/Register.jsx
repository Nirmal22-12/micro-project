import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


/* ─────────────────────────────────────────────────────────────
   Field MUST be defined OUTSIDE Register() so React doesn't
   unmount/remount it on every keystroke (which causes focus loss).
───────────────────────────────────────────────────────────── */
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", fontFamily:"Poppins,sans-serif" }}>
        {label} {required && <span style={{ color:"#e11d48" }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ fontSize:"11px", color:"#e11d48", fontFamily:"Poppins,sans-serif" }}>{error}</span>
      )}
    </div>
  );
}

/* Shared input style — defined once outside to avoid recreation */
const baseInput = {
  padding:"12px 16px",
  borderRadius:"12px",
  fontSize:"14px",
  fontFamily:"Poppins, sans-serif",
  color:"#1f2937",
  background:"#fff",
  outline:"none",
  width:"100%",
  transition:"border-color .2s, box-shadow .2s",
};

export default function Register() {
  const { register, handleGoogleAuth } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name:"", email:"", phone:"", bloodType:"",
    location:"", password:"", confirmPassword:"",
  });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [focused, setFocused]   = useState("");   /* track which field is focused */

  /* Single handler — no component recreation needed */
  const handle = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((err) => ({ ...err, [k]: "" }));
    setApiError("");
  };

  const borderColor = (key, hasError) => {
    if (hasError) return "#fca5a5";
    if (focused === key) return "#e11d48";
    return "#e5e7eb";
  };

  const boxShadow = (key) =>
    focused === key ? "0 0 0 3px rgba(225,29,72,.1)" : "none";

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name     = "Full name is required";
    if (!form.email.trim())      e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.phone.trim())      e.phone    = "Phone number is required";
    if (!form.bloodType)         e.bloodType = "Please select your blood type";
    if (!form.location.trim())   e.location = "City / Location is required";
    if (!form.password)          e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!agreed) e.agreed = "You must accept the Terms of Service";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      await register({
        name: form.name, email: form.email, password: form.password, 
        phone_number: form.phone, blood_type: form.bloodType 
      });

      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setApiError(err.message || "Registration failed");
    }
  };

  /* Password strength */
  const strength = !form.password ? 0
    : form.password.length >= 10 ? 4
    : form.password.length >= 8  ? 3
    : form.password.length >= 6  ? 2 : 1;
  const strengthColor = ["#e5e7eb","#ef4444","#f59e0b","#22c55e","#16a34a"][strength];
  const strengthLabel = ["","Too short","Weak","Good","Strong"][strength];

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"Poppins,sans-serif" }}>

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] p-14 relative overflow-hidden"
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

        {/* Content */}
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ color:"white", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:800, lineHeight:1.2, marginBottom:24 }}>
            Become a Hero.<br/>Donate Blood.
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              ["❤️","Save up to 3 lives with one donation"],
              ["🏥","Access 340+ certified donation centers"],
              ["📊","Track your donation history & impact"],
              ["🔔","Get alerts for urgent blood needs nearby"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.15)" }}>
                  {icon}
                </div>
                <span style={{ color:"rgba(255,255,255,.75)", fontSize:14 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color:"rgba(255,255,255,.4)", fontSize:12, position:"relative", zIndex:1 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color:"rgba(255,255,255,.75)", fontWeight:600, textDecoration:"none" }}>
            Sign in →
          </Link>
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"100px 24px 48px", overflowY:"auto", background:"#fafafa" }}>
        <div style={{ width:"100%", maxWidth:480 }}>

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#e11d48,#9f1239)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <span style={{ fontSize:18, fontWeight:700, color:"#111827" }}>
              Hemo<span style={{ fontWeight:300, color:"#9ca3af" }}>Life</span>
            </span>
          </div>

          <h1 style={{ fontSize:26, fontWeight:800, color:"#111827", marginBottom:4 }}>Create your account</h1>
          <p style={{ fontSize:14, color:"#9ca3af", marginBottom:28 }}>Join HemoLife and start saving lives today</p>

          {/* API Error */}
          {apiError && (
            <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:12, background:"#fee2e2", border:"1px solid #fca5a5", color:"#991b1b", fontSize:13, fontWeight:500, display:"flex", gap:8 }}>
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

              {/* Full Name */}
              <Field label="Full Name" required error={errors.name}>
                <input
                  type="text"
                  placeholder="Rahul Kumar"
                  value={form.name}
                  onChange={handle("name")}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  style={{ ...baseInput, border:`1.5px solid ${borderColor("name", errors.name)}`, boxShadow:boxShadow("name") }}
                />
              </Field>

              {/* Blood Type */}
              <Field label="Blood Type" required error={errors.bloodType}>
                <select
                  value={form.bloodType}
                  onChange={handle("bloodType")}
                  onFocus={() => setFocused("bloodType")}
                  onBlur={() => setFocused("")}
                  style={{ ...baseInput, border:`1.5px solid ${borderColor("bloodType", errors.bloodType)}`, boxShadow:boxShadow("bloodType"), cursor:"pointer" }}
                >
                  <option value="">Select type</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>

              {/* Email — spans full width */}
              <div style={{ gridColumn:"1 / -1" }}>
                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handle("email")}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    style={{ ...baseInput, border:`1.5px solid ${borderColor("email", errors.email)}`, boxShadow:boxShadow("email") }}
                  />
                </Field>
              </div>

              {/* Phone */}
              <Field label="Phone Number" required error={errors.phone}>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handle("phone")}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused("")}
                  style={{ ...baseInput, border:`1.5px solid ${borderColor("phone", errors.phone)}`, boxShadow:boxShadow("phone") }}
                />
              </Field>

              {/* Location */}
              <Field label="City / Location" required error={errors.location}>
                <input
                  type="text"
                  placeholder="Silchar, Assam"
                  value={form.location}
                  onChange={handle("location")}
                  onFocus={() => setFocused("location")}
                  onBlur={() => setFocused("")}
                  style={{ ...baseInput, border:`1.5px solid ${borderColor("location", errors.location)}`, boxShadow:boxShadow("location") }}
                />
              </Field>

              {/* Password */}
              <Field label="Password" required error={errors.password}>
                <div style={{ position:"relative" }}>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handle("password")}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    style={{ ...baseInput, border:`1.5px solid ${borderColor("password", errors.password)}`, boxShadow:boxShadow("password"), paddingRight:44 }}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, lineHeight:1, color:"#9ca3af" }}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </Field>

              {/* Confirm Password — full width */}
              <div style={{ gridColumn:"1 / -1" }}>
                <Field label="Confirm Password" required error={errors.confirmPassword}>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handle("confirmPassword")}
                    onFocus={() => setFocused("confirmPassword")}
                    onBlur={() => setFocused("")}
                    style={{ ...baseInput, border:`1.5px solid ${borderColor("confirmPassword", errors.confirmPassword)}`, boxShadow:boxShadow("confirmPassword") }}
                  />
                </Field>
              </div>

            </div>

            {/* Password strength bar */}
            {form.password && (
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                  {[1,2,3,4].map((lvl) => (
                    <div key={lvl} style={{ flex:1, height:6, borderRadius:100, transition:"background .3s", background: lvl <= strength ? strengthColor : "#e5e7eb" }} />
                  ))}
                </div>
                <p style={{ fontSize:11, color:"#9ca3af" }}>{strengthLabel} password</p>
              </div>
            )}

            {/* Terms */}
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", marginBottom:6 }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                style={{ width:16, height:16, marginTop:2, accentColor:"#e11d48", cursor:"pointer", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#4b5563", lineHeight:1.5 }}>
                I agree to the{" "}
                <span style={{ color:"#e11d48", fontWeight:600, cursor:"pointer" }}>Terms of Service</span>
                {" "}and{" "}
                <span style={{ color:"#e11d48", fontWeight:600, cursor:"pointer" }}>Privacy Policy</span>
              </span>
            </label>
            {errors.agreed && <p style={{ fontSize:11, color:"#e11d48", marginBottom:12 }}>{errors.agreed}</p>}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width:"100%", padding:"14px", borderRadius:14, border:"none", cursor:loading?"not-allowed":"pointer",
                background:"linear-gradient(135deg,#f43f5e,#be123c)", color:"white",
                fontSize:14, fontWeight:700, fontFamily:"Poppins,sans-serif",
                boxShadow:"0 8px 28px rgba(193,21,42,.3)", marginTop:8,
                opacity: loading ? .6 : 1, transition:"all .2s",
              }}>
              {loading ? "Creating account…" : "Create Account →"}
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
                  navigate("/dashboard");
                } catch (err) {
                  setLoading(false);
                  setApiError("Google authentication failed. Please try again.");
                }
              }}
              onError={() => setApiError("Google authentication failed. Please try again.")}
              useOneTap
              shape="pill"
              theme="outline"
              size="large"
              text="signup_with"
            />
          </div>

          <p style={{ textAlign:"center", fontSize:13, color:"#9ca3af", marginTop:20 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color:"#e11d48", fontWeight:700, textDecoration:"none" }}>Sign in →</Link>
          </p>
          <p style={{ textAlign:"center", marginTop:12 }}>
            <Link to="/" style={{ fontSize:12, color:"#9ca3af", textDecoration:"none" }}>← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
