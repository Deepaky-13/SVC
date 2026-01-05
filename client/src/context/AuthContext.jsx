import { createContext, useContext, useEffect, useState } from "react";
import customFetch from "../utils/customFetch";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await customFetch.get("/auth/me");
      setUser(res.data.user);
      setPermissions(res.data.permissions || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
        setPermissions([]);
      } else {
        console.error("Auth error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // 👇 LOAD ON APP START
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
        refreshAuth: loadUser, // 🔥 IMPORTANT
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
