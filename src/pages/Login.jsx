import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin'); // Login ke baad seedha Admin panel
    } catch (err) {
      alert("Galat password hai bhai! Dobara check karo.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <form onSubmit={handleSubmit} className="admin-box">
        <h2>AuraMart Admin Login 🔐</h2>
        <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required />
        <button type="submit">Entry Karo</button>
      </form>
    </div>
  );
}

export default Login;