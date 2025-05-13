import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => { checkAuth() }, []);

  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(() => { refreshToken() }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/verify');
      setUser(response.data.user);
      setJustLoggedOut(false);
    } catch (error) {
      if (error.response?.status !== 401) { console.error('Auth check failed:', error) }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await axios.post('/api/auth/refresh-token');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      setJustLoggedOut(true);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      checkAuth,
      refreshToken,
      logout,
      justLoggedOut,
      setJustLoggedOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}