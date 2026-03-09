import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext'; // Cart count ke liye
import { useAuth } from '../context/AuthContext'; // Auth logic ke liye
import { ShoppingCart, LayoutDashboard, Home, LogOut, UserPlus, LogIn } from 'lucide-react'; 

function Navbar() {
  const { cart } = useAura(); 
  const { user, isAdmin, logout } = useAuth(); // Auth context se data liya
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Bhai, logout karna hai?")) {
      await logout();
      navigate('/login'); // Logout ke baad login par bhejo
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">AuraMart<span>.</span></Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="nav-item">
          <Home size={20} /> <span>Store</span>
        </Link>
        
        {/* 1. Admin Link sirf tab dikhao jab user Admin ho */}
        {user && isAdmin && (
          <Link to="/admin" className="nav-item">
            <LayoutDashboard size={20} /> <span>Admin</span>
          </Link>
        )}
        
        {/* 2. Cart Icon */}
        <Link to="/checkout" className="nav-item cart-btn">
          <ShoppingCart size={20} />
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>

        {/* 3. Auth Buttons Logic */}
        {user ? (
          // Agar user logged in hai toh Logout dikhao
          <button onClick={handleLogout} className="nav-item logout-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444' }}>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        ) : (
          // Agar user logged out hai toh Login/Signup dikhao
          <>
            <Link to="/login" className="nav-item">
              <LogIn size={20} /> <span>Login for admin</span>
            </Link>
            <Link to="/signup" className="nav-item">
              <UserPlus size={20} /> <span>Signup and login for user</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;