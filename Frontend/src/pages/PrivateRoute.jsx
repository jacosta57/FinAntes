import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'AuthContext';

function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) { return <div>Loading...</div> }
  if (!user) { return <Navigate to={`/auth?tab=login&redirect=${location.pathname}`} replace /> }

  return <Outlet />;
}

export default PrivateRoute;