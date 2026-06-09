import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCampaigns, registerForCampaign, createCampaign } from "../services/api";
import CampaignCard from "../components/CampaignCard";

export default function Campaigns() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [registeringId, setRegisteringId] = useState(null);

  // New campaign request states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newCampName, setNewCampName] = useState("");
  const [newCampDate, setNewCampDate] = useState("");
  const [newCampLoc, setNewCampLoc] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

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

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!newCampName || !newCampDate || !newCampLoc) {
      setRequestError("All fields are required.");
      return;
    }

    try {
      setRequestLoading(true);
      setRequestError("");
      await createCampaign({
        name: newCampName,
        event_date: newCampDate,
        location: newCampLoc
      });
      setToast("🎉 Campaign requested successfully!");
      setShowRequestModal(false);
      setNewCampName("");
      setNewCampDate("");
      setNewCampLoc("");
      // Refresh list
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      setRequestError(err.message || "Failed to submit request.");
    } finally {
      setRequestLoading(false);
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
          <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "520px", margin: "0 auto", lineHeight: "1.7", marginBottom: "24px" }}>
            Browse active blood drives near you. Register in advance to save time and help centers coordinate.
          </p>
          {user && (
            <button
              onClick={() => setShowRequestModal(true)}
              style={{
                background: "linear-gradient(135deg, #f43f5e, #be123c)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 18px rgba(244, 63, 94, 0.3)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              ➕ Request New Campaign
            </button>
          )}
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

      {/* Request Campaign Modal */}
      {showRequestModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(17, 24, 39, 0.4)", backdropFilter: "blur(8px)",
          zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px"
        }}>
          <div style={{
            background: "white", borderRadius: "24px", padding: "32px",
            width: "100%", maxWidth: "480px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            animation: "fadeInUp 0.3s ease", boxSizing: "border-box", position: "relative"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", margin: 0 }}>Request New Campaign</h2>
              <button 
                onClick={() => setShowRequestModal(false)}
                style={{ background: "none", border: "none", fontSize: "20px", color: "#9ca3af", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {requestError && (
              <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: 500, marginBottom: "16px" }}>
                ⚠️ {requestError}
              </div>
            )}

            <form onSubmit={handleSubmitRequest}>
              {/* Requester Info */}
              <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "16px", marginBottom: "20px", border: "1px solid #f3f4f6" }}>
                <h4 style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", margin: "0 0 8px 0", letterSpacing: "0.05em" }}>Requester Details</h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Name:</span>
                  <span style={{ fontSize: "13px", color: "#1f2937", fontWeight: 600 }}>{user?.name || "Anonymous"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Email:</span>
                  <span style={{ fontSize: "13px", color: "#1f2937", fontWeight: 600 }}>{user?.email || "N/A"}</span>
                </div>
              </div>

              {/* Campaign Name */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#4b5563", fontWeight: 600, marginBottom: "6px" }}>Campaign Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g., Annual Youth Blood Drive"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1px solid #e5e7eb", fontSize: "14px", background: "#f9fafb",
                    boxSizing: "border-box", outline: "none"
                  }}
                  required
                />
              </div>

              {/* Date */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#4b5563", fontWeight: 600, marginBottom: "6px" }}>Event Date</label>
                <input
                  type="date"
                  value={newCampDate}
                  onChange={(e) => setNewCampDate(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1px solid #e5e7eb", fontSize: "14px", background: "#f9fafb",
                    boxSizing: "border-box", outline: "none"
                  }}
                  required
                />
              </div>

              {/* Location */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#4b5563", fontWeight: 600, marginBottom: "6px" }}>Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g., Cachar Cancer Hospital"
                  value={newCampLoc}
                  onChange={(e) => setNewCampLoc(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1px solid #e5e7eb", fontSize: "14px", background: "#f9fafb",
                    boxSizing: "border-box", outline: "none"
                  }}
                  required
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  style={{
                    padding: "12px 20px", borderRadius: "12px", border: "1px solid #e5e7eb",
                    background: "white", color: "#4b5563", fontWeight: 600, fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestLoading}
                  style={{
                    padding: "12px 24px", borderRadius: "12px", border: "none",
                    background: "linear-gradient(135deg, #f43f5e, #be123c)",
                    color: "white", fontWeight: 600, fontSize: "14px", cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(244, 63, 94, 0.3)",
                    opacity: requestLoading ? 0.7 : 1
                  }}
                >
                  {requestLoading ? "Submitting..." : "Request Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
