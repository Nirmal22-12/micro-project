import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLogin, registerUser as apiRegister } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const login = async (formPayload) => {
    // Note: loginUser in api.js expects { email, password }
    const response = await apiLogin(formPayload);
    const { token, ...userData } = response;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    return { success: true };
  };

  const handleGoogleAuth = async (credential) => {
    const { googleLogin } = await import("../services/api");
    const response = await googleLogin(credential);
    const { token, ...userData } = response;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    return { success: true };
  };

  const register = async (userData) => {
    // Note: registerUser expects { name, email, password, phone_number, blood_type, location, etc. }
    const response = await apiRegister(userData);
    const { token, ...userDataWithoutToken } = response;
    setUser(userDataWithoutToken);
    localStorage.setItem("user", JSON.stringify(userDataWithoutToken));
    localStorage.setItem("token", token);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUserSession = (newData) => {
    setUser(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider value={{ user, login, handleGoogleAuth, register, logout, loading, updateUserSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
