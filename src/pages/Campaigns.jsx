import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCampaigns, registerForCampaign } from "../services/api";
import CampaignCard from "../components/CampaignCard";

export default function Campaigns() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [registeringId, setRegisteringId] = useState(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleRegister = async (campaignId) => {
    if (!user) {
      navigate("/login", { state: { msg: "Please sign in to register for campaigns." } });
      return;
    }

    try {
      setRegisteringId(campaignId);
      const res = await registerForCampaign(campaignId);
      setToast("🎉 " + (res.message || "Registered successfully!"));
      // Refresh list to update count
      fetchCampaigns();
    } catch (err) {
      setToast("⚠️ " + (err.message || "Already registered or error occurred."));
    } finally {
      setRegisteringId(null);
      setTimeout(() => setToast(""), 4000);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: "#f9fafb", minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "100px", left: "50%", transform: "translateX(-50%)",
          background: "#1f2937", color: "white", padding: "12px 24px", borderRadius: "100px",
          fontWeight: 600, fontSize: "14px", zIndex: 1000, boxShadow: "0 10px 30px rgba(0,0,0,.15)",
          animation: "fadeInUp .3s ease forwards"
        }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ display: "inline-block", background: "#fff1f2", color: "#e11d48", fontSize: "11px", fontWeight: 700, padding: "6px 14px", borderRadius: "100px", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "14px" }}>
            Active Drives
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
            Donation Campaigns
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "520px", margin: "0 auto", lineHeight: "1.7" }}>
            Browse active blood drives near you. Register in advance to save time and help centers coordinate.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "white", borderRadius: "22px", height: "380px", border: "1px solid #f3f4f6", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "24px", border: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: "36px" }}>⚠️</span>
            <p style={{ color: "#9ca3af", marginTop: "10px" }}>{error}</p>
            <button onClick={fetchCampaigns} style={{ marginTop: "16px", padding: "10px 20px", borderRadius: "10px", background: "#e11d48", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>Retry</button>
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 40px", background: "white", borderRadius: "24px", border: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: "48px" }}>🏜️</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "16px" }}>No active campaigns</h3>
            <p style={{ color: "#9ca3af", marginTop: "6px" }}>There are no upcoming blood drives currently scheduled. Check back soon!</p>
          </div>
        ) : (
          /* Campaigns list */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
            {campaigns.map((c, i) => (
              <CampaignCard 
                key={c.id} 
                campaign={c} 
                index={i} 
                onRegister={() => handleRegister(c.id)} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
