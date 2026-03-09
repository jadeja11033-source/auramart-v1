import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();

  // Jab tak Firebase check kar raha hai, tab tak "Loading" dikhao
  if (loading) return <div>Loading...</div>;

  // 1. Agar user logged in nahi hai, toh Login page par bhejo
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Agar page sirf Admin ke liye hai aur user admin nahi hai, toh Home bhejo
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Sab sahi hai toh page dikhao
  return children;
};

export default ProtectedRoute;