import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Indian states
const INDIAN_STATES = [
  "All", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const getBloodBadgeColor = (bg) => {
  if (!bg) return 'bg-gray-500 text-white';
  // AB must come before A to avoid false match
  if (bg === 'AB+') return 'bg-purple-500 shadow-purple-500/40 text-white';
  if (bg === 'AB-') return 'bg-purple-700 shadow-purple-700/40 text-white';
  if (bg === 'A+') return 'bg-red-500 shadow-red-500/40 text-white';
  if (bg === 'A-') return 'bg-red-700 shadow-red-700/40 text-white';
  if (bg === 'B+') return 'bg-blue-500 shadow-blue-500/40 text-white';
  if (bg === 'B-') return 'bg-blue-700 shadow-blue-700/40 text-white';
  if (bg === 'O+') return 'bg-green-500 shadow-green-500/40 text-white';
  if (bg === 'O-') return 'bg-green-700 shadow-green-700/40 text-white';
  return 'bg-gray-500 text-white';
};

export default function Donors() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Search State
  const [bloodGroup, setBloodGroup] = useState("All");
  const [city, setCity] = useState("");
  const [state, setState] = useState("All");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  
  // Filters
  const [availability, setAvailability] = useState("All Donors");
  const [lastDonated, setLastDonated] = useState("Any time");
  const [sortBy, setSortBy] = useState("Recently Active");
  
  // Results
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [callingDonorId, setCallingDonorId] = useState(null);

  const handleCallDonor = async (donorId) => {
    if (!user) {
      navigate('/login', { state: { msg: 'Please login to contact donors.' } });
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login', { state: { msg: 'Session expired. Please login again.' } });
      return;
    }

    setCallingDonorId(donorId);
    showToast("🔒 Connecting secure masked call...");
    try {
      const res = await axios.post(`http://localhost:5000/api/donors/${donorId}/call`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("✅ " + (res.data.message || "Call initiated successfully."));
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to initiate call.";
      showToast("❌ " + msg);
    } finally {
      setCallingDonorId(null);
    }
  };

  // Debounced Search and Fetch
  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {
        bloodGroup,
        city,
        state,
        availability,
        lastDonated,
        sortBy,
        page,
        limit: 10
      };
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }

      const res = await axios.get("http://localhost:5000/api/donors/search", { params });
      console.log("Search response:", res.data);
      setDonors(res.data.donors || []);
      setTotalCount(res.data.totalDonors || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch donors error:", err?.response?.data || err?.message || err);
      showToast("Error fetching donors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDonors();
    }, 400); // 400ms debounce
    return () => clearTimeout(delayDebounceFn);
  }, [bloodGroup, city, state, availability, lastDonated, sortBy, page, lat, lng]);

  // Suggestions Fetcher
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/donors/search/suggestions", { params: { city } });
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [city]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        // Automatically sort by nearest if location is used
        setSortBy("Nearest");
        
        // Reverse Geocode to get City Name
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}`);
          if (res.data && res.data.address) {
            const currentCity = res.data.address.city || res.data.address.town || res.data.address.village || "";
            if (currentCity) setCity(currentCity);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        }
      },
      (error) => {
        showToast("Location permission denied or unavailable");
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]" style={{ paddingTop: "100px", fontFamily: "Inter, sans-serif" }}>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* PREMIUM TOP SEARCH BAR */}
        <div className="bg-white p-4 sm:p-6 mb-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 backdrop-blur-xl relative z-20">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Blood Group */}
            <div className="flex-1 w-full lg:w-auto relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="text-red-500 font-bold">🩸</span>
              </div>
              <select 
                value={bloodGroup} 
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl block pl-12 p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer appearance-none"
              >
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg === 'All' ? 'All Blood Groups' : bg}</option>)}
              </select>
            </div>

            {/* City with Autocomplete */}
            <div className="flex-1 w-full lg:w-auto relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="City Name"
                value={city}
                onChange={e => {
                  setCity(e.target.value);
                  setShowSuggestions(true);
                  setLat(null); // invalidate coordinates if user types a new logic
                  setLng(null);
                  if (sortBy === 'Nearest') setSortBy('Recently Active');
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl block pl-12 p-4 outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-inner"
              />
              {/* Dropdown Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-100 rounded-xl mt-2 shadow-2xl max-h-60 overflow-auto">
                  {suggestions.map((s, i) => (
                    <li 
                      key={i} 
                      onClick={() => { setCity(s); setShowSuggestions(false); }}
                      className="px-4 py-3 hover:bg-red-50 text-gray-700 cursor-pointer font-medium text-sm transition-colors border-b border-gray-50 last:border-0"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* State */}
            <div className="flex-1 w-full lg:w-auto">
              <select 
                value={state} 
                onChange={e => setState(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl block p-4 outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-pointer appearance-none"
              >
                {INDIAN_STATES.map(st => <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>)}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full lg:w-auto">
              <button 
                onClick={handleUseLocation}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-2xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                title="Use My Location"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.194 2.027-.547 3m-2.25 5.225A12.006 12.006 0 0012 21a12.006 12.006 0 002.753-9.571"></path></svg>
                <span className="lg:hidden">My Location</span>
              </button>
              
              <button 
                onClick={fetchDonors}
                className="flex-1 lg:flex-none bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5"
              >
                Search Donors
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-32">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Filter Options
              </h2>
              
              <div className="space-y-8">
                {/* Availability Toggle */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-3">Availability</label>
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                    {["All Donors", "Available Now"].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setAvailability(opt)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${availability === opt ? 'bg-white shadow-sm text-red-600 border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Last Donated Filter */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-3">Last Donated</label>
                  <div className="space-y-2">
                    {["Any time", "3+ months ago", "6+ months ago"].map(opt => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="lastDonated" 
                          value={opt}
                          checked={lastDonated === opt}
                          onChange={e => setLastDonated(e.target.value)}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 focus:ring-2 accent-red-600"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-3">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium appearance-none"
                  >
                    <option value="Recently Active">Recently Active</option>
                    <option value="Nearest">Nearest Location</option>
                    <option value="Name A-Z">Name (A-Z)</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* RESULTS SECTION */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Available Donors</h1>
                <p className="text-gray-500 mt-1 font-medium bg-white px-3 py-1 rounded-full text-sm inline-block shadow-sm">
                  <span className="font-bold text-red-600">{totalCount}</span> donors found {city ? `in ${city}` : 'matching criteria'}
                </p>
              </div>
            </div>

            {loading ? (
              // Skeletons
              <div className="grid gap-6 auto-rows-max">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-6 animate-pulse">
                    <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1 py-2">
                       <div className="w-1/3 h-5 bg-gray-200 rounded-lg mb-3"></div>
                       <div className="w-1/4 h-4 bg-gray-100 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : donors.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🏜️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-500 max-w-sm mb-6">We couldn't find any donors matching your criteria. Try adjusting your filters or searching in nearby cities.</p>
                <button 
                  onClick={() => { setBloodGroup('All'); setCity(''); setState('All'); fetchDonors(); }}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              // Donor Cards
              <div className="grid gap-5">
                {donors.map((donor, idx) => (
                  <div key={idx} className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                    
                    {/* Hover Gradient Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply pointer-events-none rounded-tr-[1.5rem]" />

                    {/* Left: Blood Badge & Avatar */}
                    <div className="relative">
                      {donor.avatar ? (
                        <img src={donor.avatar} alt={donor.name} className="w-[72px] h-[72px] rounded-2xl object-cover shadow-sm" />
                      ) : (
                        <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl shadow-sm border border-gray-200/50">
                          {donor.name ? donor.name.substring(0, 2).toUpperCase() : 'NB'}
                        </div>
                      )}
                      
                      {/* Blood Badge overlapping */}
                      <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-lg ${getBloodBadgeColor(donor.bloodGroup)} ring-4 ring-white`}>
                        {donor.bloodGroup}
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{donor.name}</h3>
                        {/* Availability Badge */}
                        {(() => {
                          const avail = donor.availabilityStatus || (donor.isAvailable ? 'available' : 'busy');
                          if (avail === 'recently_donated') {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold border border-red-100 mx-auto sm:mx-0">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Recently Donated
                              </span>
                            );
                          }
                          if (avail === 'busy') {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-800 text-[11px] font-bold border border-yellow-100 mx-auto sm:mx-0">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div> Busy
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-bold border border-green-100 mx-auto sm:mx-0">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Available Now
                            </span>
                          );
                        })()}
                      </div>
                      
                      <div className="text-sm font-medium text-gray-500 flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-3">
                        {donor.city && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            {donor.city}{donor.state ? `, ${donor.state}` : ''}
                          </span>
                        )}
                        
                        {donor.distance && (
                           <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                             {parseFloat(donor.distance).toFixed(1)} km away
                           </span>
                        )}
                      </div>
                      
                      <div className="text-xs font-semibold text-gray-400">
                        {donor.lastDonated ? `Last donated: ${new Date(donor.lastDonated).toLocaleDateString()}` : 'No previous donation records'}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="w-full sm:w-auto flex flex-col sm:flex-col justify-center sm:justify-end gap-3 mt-2 sm:mt-0">
                      <Link
                        to={`/donors/${donor.id}`}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        View Profile
                      </Link>
                      <button 
                        onClick={() => handleCallDonor(donor.id)}
                        disabled={callingDonorId === donor.id}
                         className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm w-full sm:w-auto ${
                           callingDonorId === donor.id 
                             ? 'bg-green-50 text-green-700 border border-green-200 cursor-wait' 
                             : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                         }`}
                      >
                        {callingDonorId === donor.id ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            Contact Donor
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <span className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                      Page {page} of {totalPages}
                    </span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
