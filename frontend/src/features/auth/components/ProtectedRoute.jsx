import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
