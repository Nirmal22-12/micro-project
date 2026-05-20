import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar         from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home      from "./pages/Home";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Donors    from "./pages/Donors";
import AddDonor  from "./pages/AddDonor";
import Profile   from "./pages/Profile";
import DonorProfile from "./pages/DonorProfile";
import WhyDonate from "./pages/WhyDonate";
import BadgesPage from "./pages/BadgesPage";
import FindDonors from "./pages/FindDonors";
import Donations from "./pages/Donations";
import Certificate from "./pages/Certificate";

import "./styles/global.css";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>

        {/* ════ PUBLIC — anyone can visit ════ */}
        <Route path="/"      element={<Home />} />
        <Route path="/why-donate" element={<WhyDonate />} />
        <Route path="/donors" element={<Donors />} />   {/* read-only public view */}
        <Route path="/donors/search" element={<FindDonors />} />

        {/* ════ AUTH PAGES — redirect to dashboard if already logged in ════ */}
        <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

        {/* ════ PROTECTED — must be logged in ════ */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/donors/add" element={<ProtectedRoute><AddDonor /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/donors/:id" element={<ProtectedRoute><DonorProfile /></ProtectedRoute>} />
        <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
        <Route path="/donations/:id/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />

        {/* ════ 404 ════ */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            <div className="text-6xl">🩸</div>
            <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
            <a href="/" className="text-red-600 font-semibold hover:underline text-sm">← Back to LifeFlow</a>
          </div>
        } />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />

      </AuthProvider>
    </BrowserRouter>
  );
}
