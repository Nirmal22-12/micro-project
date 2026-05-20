import { useState } from 'react';
import { searchDonors } from '../services/api';

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function FindDonors() {
  const [selectedType, setSelectedType] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!selectedType) return;
    setLoading(true);
    setError('');
    
    try {
      const results = await searchDonors(selectedType);
      setDonors(results);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to search donors');
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (phone, name) => {
    if (!phone) return;
    // Strip non-numeric characters for the WhatsApp URI
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const defaultMsg = encodeURIComponent(`Hi ${name}, I found your contact on LifeFlow. I am in urgent need of ${selectedType} blood. Are you available to help?`);
    window.open(`https://wa.me/${cleanPhone}?text=${defaultMsg}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%] bg-gray-50 flex justify-center w-full" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-center mt-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Find a Donor</h1>
          <p className="text-gray-500">Select a blood type to find eligible active donors instantly.</p>
        </div>

        {/* 1 & 2: Search Bar & Dropdown */}
        <div className="flex bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto gap-4 mb-10">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl outline-none font-medium text-gray-800"
          >
            <option value="" disabled>Select Blood Type</option>
            {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button 
            onClick={handleSearch}
            disabled={!selectedType || loading}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
            style={{ backgroundImage: "linear-gradient(135deg, #f43f5e, #be123c)" }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
            <div className="mx-auto max-w-xl mb-8 p-4 text-center rounded-xl bg-red-50 text-red-600 font-medium border border-red-100">
                ⚠️ {error}
            </div>
        )}

        {searched && donors.length === 0 && !loading && (
           <div className="text-center text-gray-400 py-10 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto">
             No eligible donors found for {selectedType} at this moment. 
           </div>
        )}

        {/* 3: Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-start gap-4 mb-5 relative z-10">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                    {donor.name ? donor.name.charAt(0).toUpperCase() : "-"}
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900">{donor.name}</h3>
                   <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold mt-1">
                     {donor.blood_type}
                   </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-6 font-medium relative z-10 flex items-center gap-2">
                 📞 <span className="tracking-wide text-gray-700">{donor.phone_number || "No number provided"}</span>
              </div>

              {/* 4: WhatsApp Contact Button */}
              <button 
                onClick={() => openWhatsApp(donor.phone_number || "", donor.name)}
                disabled={!donor.phone_number}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative z-10 font-[inherit]"
              >
                Message on WhatsApp
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
