import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDonors, getStats, getRequests } from "../services/api";

export default function Dashboard() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [donors, setDonors] = useState([]);
  const [bloodCount, setBloodCount] = useState({});
  const [requests, setRequests] = useState([]);
  const [revealedIds, setRevealedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorsData = await getDonors();
        setDonors(donorsData || []);
        
        const statsData = await getStats();
        // statsData comes as [{ blood_type: 'A+', count: '2' }, ...]
        const counts = {};
        if (statsData) {
          statsData.forEach(item => {
             counts[item.blood_type] = parseInt(item.count, 10);
          });
        }
        setBloodCount(counts);

        const reqsData = await getRequests();
        setRequests(reqsData || []);
      } catch(err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  /* ── Live metrics from donor data ── */
  const total     = donors.length;
  const eligible  = donors.filter((d) => d.status === "eligible").length;
  const temp      = donors.filter((d) => d.status === "temporary").length;
  const permanent = donors.filter((d) => d.status === "permanent").length;

  /* Blood type counts */
  const BLOOD_TYPES = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

  /* Low stock threshold */
  const isLow = (t) => (bloodCount[t] || 0) <= 1;

  const recent = [...donors].slice(0, 5);

  const METRICS = [
    { label:"Total Donors",    value: total,     change:`${donors.length} registered`, up:true,  icon:"🩸", bar:"linear-gradient(90deg,#fb7185,#e11d48)",  icon_bg:"#fff1f2" },
    { label:"Eligible Now",    value: eligible,  change:`${Math.round(eligible/total*100)||0}% of total`,  up:true,  icon:"✅", bar:"linear-gradient(90deg,#4ade80,#16a34a)",  icon_bg:"#f0fdf4" },
    { label:"Active Campaigns",value:"43",       change:"3 new today",                up:true,  icon:"🏥", bar:"linear-gradient(90deg,#60a5fa,#3b82f6)",  icon_bg:"#eff6ff" },
    { label:"Needs Review",    value: temp+permanent, change:"Temp + Ineligible",     up:false, icon:"⚠️", bar:"linear-gradient(90deg,#fb923c,#f97316)", icon_bg:"#fff7ed" },
  ];

  return (
    <div className="min-h-screen pt-[100px] pb-16 px-[5%]"
      style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* ── Hero banner ── */}
      <div className="rounded-[28px] p-10 text-white mb-8 relative overflow-hidden flex items-center justify-between flex-wrap gap-6"
        style={{ background: "linear-gradient(135deg,#be123c,#881337)" }}>
        <div className="absolute w-[280px] h-[280px] rounded-full -right-8 -bottom-8"
          style={{ border: "56px solid rgba(255,255,255,.07)" }} />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">Good day 👋</p>
          <h1 className="text-[1.8rem] font-bold text-white mb-1">Welcome, {user?.name?.split(" ")[0] || "Admin"}</h1>
          <p className="text-white/65 text-sm">
            {user?.role === "admin" ? "Full admin access · " : "Donor account · "}
            {new Date().toLocaleDateString("en-IN", { weekday:"long", month:"long", day:"numeric" })}
          </p>
        </div>
        <button onClick={() => navigate("/donors/add")}
          className="px-6 py-3 rounded-xl text-white text-sm font-bold border-none cursor-pointer relative z-10 transition-all hover:-translate-y-0.5 font-[inherit]"
          style={{ background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.3)", backdropFilter:"blur(8px)" }}>
          + Register Donor
        </button>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-white rounded-[20px] p-6 border border-gray-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}
            onMouseEnter={(e)=>e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.1)"}
            onMouseLeave={(e)=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.05)"}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px]" style={{ background: m.bar }} />
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-3.5 mt-1" style={{ background: m.icon_bg }}>{m.icon}</div>
            <div className="text-[2rem] font-extrabold text-gray-900 mb-1">{m.value}</div>
            <div className="text-xs text-gray-400 font-medium">{m.label}</div>
            <div className={`text-xs font-semibold mt-2.5 ${m.up ? "text-green-600" : "text-red-500"}`}>{m.change}</div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

        <div className="flex flex-col gap-6">

          {/* Current Blood Requests (Emergency Board) */}
          {requests.length > 0 && (
            <div className="bg-red-50 rounded-[22px] p-7 border border-red-100" style={{ boxShadow:"0 1px 4px rgba(220,38,38,.1)" }}>
              <h2 className="text-base font-bold text-red-700 mb-5 flex items-center gap-2">🚨 Active Emergencies</h2>
              <div className="flex flex-col gap-4">
                {requests.map(r => {
                  const revealed = revealedIds.includes(r.id);
                  return (
                    <div key={r.id} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden transition-all duration-300">
                      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: r.urgency === 'High' ? '#dc2626' : '#f97316' }}></div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{r.patient_name}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">{r.blood_type}</span>
                            {r.urgency === 'High' && <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase animate-pulse">Critical</span>}
                          </div>
                          {revealed ? (
                            <div className="text-xs text-gray-700 mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                              <p className="font-semibold mb-1">🏥 {r.hospital_name}</p>
                              <p className="font-medium flex items-center gap-1">📞 <span className="tracking-wide text-gray-900">{r.contact_number}</span></p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">📍 Hospital Details Protected</p>
                          )}
                        </div>
                        <button 
                          onClick={() => setRevealedIds(prev => prev.includes(r.id) ? prev.filter(x=>x!==r.id) : [...prev, r.id])}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex-shrink-0 ${revealed ? 'bg-gray-100 text-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
                          style={revealed ? {} : { boxShadow: "0 4px 14px rgba(220,38,38,.3)" }}
                        >
                          {revealed ? "Hide Contact" : "Help Now"}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        {/* Recent donors */}
        <div className="bg-white rounded-[22px] p-7 border border-gray-100" style={{ boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">Recent Registrations</h2>
            <button onClick={() => navigate("/donors")}
              className="text-xs text-red-500 font-medium cursor-pointer border-none bg-transparent font-[inherit]">
              View all →
            </button>
          </div>
          {recent.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm">No donors registered yet.</div>
          )}
          {recent.map((d) => {
          const st = { eligible:"bg-red-50 text-red-600", temporary:"bg-amber-50 text-amber-800", permanent:"bg-gray-100 text-gray-500" };
          return (
            <div key={d.id} className="flex items-center gap-3.5 py-3 border-b border-gray-50 last:border-none last:pb-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: "#f43f5e" }}>
                {d.name ? d.name.charAt(0).toUpperCase() : "-"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.blood_type || "-"} · {d.last_donation_date ? new Date(d.last_donation_date).toLocaleDateString() : 'No recorded date'}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${st[d.status] || "bg-gray-100 text-gray-500"}`}>
                {d.status || 'Active'}
              </span>
            </div>
          );
        })}
        </div>
      </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Blood inventory */}
          <div className="bg-white rounded-[22px] p-7 border border-gray-100" style={{ boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
            <h2 className="text-base font-bold text-gray-900 mb-5">Blood Type Inventory</h2>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map((t) => {
                const count = bloodCount[t] || 0;
                const low   = isLow(t);
                return (
                  <div key={t} className="text-center py-3 rounded-2xl transition-all hover:scale-105 cursor-default"
                    style={{ background: low ? "#fee2e2" : "#fff1f2" }}>
                    <div className="text-base font-extrabold" style={{ color: low ? "#991b1b" : "#be123c" }}>{t}</div>
                    <div className="text-[10px] font-medium mt-0.5" style={{ color: low ? "#dc2626" : "#fb7185" }}>
                      {count} {low && count === 0 ? "⚠" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">Based on {total} registered donors</p>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-[22px] p-7 border border-gray-100" style={{ boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
            <h2 className="text-base font-bold text-gray-900 mb-5">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/donors/add")}
                className="w-full py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer transition-all hover:-translate-y-0.5 font-[inherit]"
                style={{ background:"linear-gradient(135deg,#f43f5e,#be123c)", boxShadow:"0 6px 20px rgba(193,21,42,.28)" }}>
                + Register New Donor
              </button>
              <button onClick={() => navigate("/donors")}
                className="w-full py-3 rounded-2xl text-gray-600 text-sm font-semibold border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all font-[inherit]">
                👥 View All Donors
              </button>
              <button onClick={() => navigate("/profile")}
                className="w-full py-3 rounded-2xl text-red-600 text-sm font-semibold border border-red-100 bg-red-50 cursor-pointer hover:bg-red-100 transition-all font-[inherit]">
                👤 My Profile
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
