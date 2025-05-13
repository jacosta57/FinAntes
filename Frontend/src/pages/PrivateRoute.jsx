import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'AuthContext';
import { useEffect } from 'react';

function PrivateRoute() {
  const { user, loading, justLoggedOut, setJustLoggedOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (justLoggedOut) { setJustLoggedOut(false) }
  }, [justLoggedOut, setJustLoggedOut]);

  if (loading) { return <div>Loading...</div> }

  if (!user) {
    if (justLoggedOut) { return <Navigate to="/auth?tab=login" replace />; }

    return <Navigate to={`/auth?tab=login&redirect=${location.pathname}`} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;