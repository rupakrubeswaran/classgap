import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullPage />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) {
    // Redirect to their own dashboard
    return <Navigate to={user.role === 'staff' ? '/staff/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
}