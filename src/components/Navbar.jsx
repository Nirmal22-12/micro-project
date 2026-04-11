import { useState, useEffect, useRef } from "react";
import BadgesModal from "./BadgesModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const { user, logout }            = useAuth();
  const location                    = useLocation();
  const navigate                    = useNavigate();
  const dropRef                     = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdown(false); }, [location]);

  const handleLogout = () => { logout(); navigate("/login"); };

  const links = [
    { path: "/",           label: "Home" },
    { path: "/dashboard",  label: "Dashboard" },
    { path: "/donors",     label: "Donors" },
    { path: "/donors/add", label: "Campaigns" },
    { path: "/donations",  label: "Donations" },
    { path: "/profile",    label: "Profile" },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-[72px] transition-all duration-300 ${scrolled ? "shadow-[0_4px_24px_rgba(193,21,42,.1)]" : ""}`}
      style={{ background: "rgba(255,255,255,.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(225,29,72,.08)", fontFamily: "Poppins, sans-serif" }}
    >
      {/* ── Logo ── */}
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 no-underline">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
        </div>
        <span className="text-lg font-bold"
          style={{ background: "linear-gradient(135deg,#be123c,#881337)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Hemo<span style={{ fontWeight: 300 }}>Life</span>
        </span>
      </Link>

      {/* ── Desktop Nav Links ── */}
      {user && (
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ path, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${active ? "text-red-600 bg-red-50" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}`}>
                {label}
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Right Side ── */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
           <button
               onClick={() => navigate("/badges")}
               title="My Badges"
               style={{
               background:"#fff1f2", border:"1.5px solid #fecdd3",
               borderRadius:12, width:40, height:40, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, transition:"all .2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background="#ffe4e6"}
                  onMouseLeave={(e) => e.currentTarget.style.background="#fff1f2"}>
                 🏅
            </button>

            {/* Donate Now */}
            <Link to="/donors/add"
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-xl text-white text-sm font-semibold no-underline transition-all hover:-translate-y-px"
              style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)", boxShadow: "0 6px 20px rgba(193,21,42,.25)" }}>
              🩸 Donate Now
            </Link>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropdown(!dropdownOpen)}
                className="flex items-center gap-2.5 border-none bg-transparent cursor-pointer p-1.5 rounded-xl hover:bg-red-50 transition-all"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#f43f5e,#9f1239)" }}>
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-gray-800 leading-tight">{user.name?.split(" ")[0]}</p>
                  <p className="text-[10px] font-semibold leading-tight capitalize"
                    style={{ color: user.role === "admin" ? "#e11d48" : "#9ca3af" }}>
                    {user.role}
                  </p>
                </div>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-60 bg-white rounded-2xl border border-gray-100 py-1.5 z-50"
                  style={{ boxShadow: "0 16px 48px rgba(0,0,0,.14)" }}>
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {user.bloodType && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">{user.bloodType}</span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{ background: user.role === "admin" ? "#fee2e2" : "#f0fdf4", color: user.role === "admin" ? "#991b1b" : "#166534" }}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {[
                    { icon: "👤", label: "My Profile",    path: "/profile" },
                    { icon: "📊", label: "Dashboard",     path: "/dashboard" },
                    { icon: "🩸", label: "Donors List",   path: "/donors" },
                    { icon: "📋", label: "Register Donor",path: "/donors/add" },
                  ].map(({ icon, label, path }) => (
                    <Link key={label} to={path}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 no-underline transition-all">
                      <span className="w-5 text-center text-base">{icon}</span>{label}
                    </Link>
                  ))}

                  <div className="border-t border-gray-50 mt-1.5 pt-1.5">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer transition-all font-[inherit] text-left">
                      <span className="w-5 text-center text-base">🚪</span>Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Not logged in */
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 no-underline hover:bg-gray-100 transition-all">Sign In</Link>
            <Link to="/register"
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold no-underline transition-all hover:-translate-y-px"
              style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)", boxShadow: "0 6px 20px rgba(193,21,42,.25)" }}>
              Get Started →
            </Link>
          </div>
        )}

        {/* Hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2 border-none bg-transparent cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {[0,1,2].map((i) => <span key={i} className="w-6 h-0.5 rounded block" style={{ background: "#be123c" }} />)}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-red-100 shadow-lg py-4 px-[5%] flex flex-col gap-2 md:hidden z-50">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-2xl mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#f43f5e,#9f1239)" }}>{initials}</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-red-500 font-semibold capitalize">{user.role}</p>
                </div>
              </div>
              {links.map(({ path, label }) => (
                <Link key={path} to={path}
                  className="py-2.5 px-4 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 no-underline transition-all">
                  {label}
                </Link>
              ))}
              <Link to="/badges"
                 className="py-2.5 px-4 rounded-xl text-sm font-semibold text-red-600 border border-red-100 bg-red-50 no-underline hover:bg-red-100 transition-all">
                🏅 My Badges
              </Link>

            </>
          ) : (
            <>
              <Link to="/login" className="py-2.5 px-4 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 no-underline">Sign In</Link>
              <Link to="/register" className="py-2.5 px-4 rounded-xl text-sm font-semibold text-white no-underline text-center"
                style={{ background: "linear-gradient(135deg,#e11d48,#9f1239)" }}>Get Started →</Link>
            </>
          )}
        </div>
      )}

      {/* ── Badges Modal — must be here at nav root level ── */}
      {showBadges && <BadgesModal onClose={() => setShowBadges(false)} />}

    </nav>
  );
}