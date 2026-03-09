import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      alert("AuraMart mein swagat hai! 🛍️");
      navigate('/'); // Register ke baad seedha Home
    } catch (err) {
      alert("Signup Error: " + err.message);
    }
  };

  return (
    <div className="admin-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <form onSubmit={handleSignup} className="admin-box">
        <h2 style={{ textAlign: 'center', color: '#6366f1' }}>Naya Account ✨</h2>
        <input 
          type="email" placeholder="Email Address" 
          onChange={(e)=>setEmail(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Password (Min 6 chars)" 
          onChange={(e)=>setPassword(e.target.value)} required 
        />
        <button type="submit">Account Banayein</button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Pehle se account hai? <Link to="/login">Login karein</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;