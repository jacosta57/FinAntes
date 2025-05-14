import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth()
  }, []);

  useEffect(() => {
    if (!user) return;
    const refreshInterval = setInterval(() => { refreshToken() }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(refreshInterval);
  }, [user]);

  const checkAuth = async () => {
    console.log("Authentication Checked")
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/verify');
      setUser(response.data.user);
      setLoggedIn(true);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          const response = await axios.get('/api/auth/verify');
          setUser(response.data.user);
          setLoggedIn(true);
        } catch (refreshError) {
          console.log('Auth check and refresh failed');
          setUser(null);
          setLoggedIn(false);
        }
      } else {
        console.log('Auth check failed');
        setUser(null);
        setLoggedIn(false);
      }
    } finally { 
      setLoading(false);
    }
  };
  const refreshToken = async () => {
    console.log("Getting New Token")
    try {
      await axios.post('/api/auth/refresh-token');
      return true;
    } catch (error) {
      console.log('Token refresh failed');
      if (error.response?.status === 401) { setUser(null) }
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      return true;
    } catch (error) {
      console.log('Logout failed');
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
      loggedIn
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}