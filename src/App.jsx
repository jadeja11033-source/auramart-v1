import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuraProvider } from './context/AuraContext'; 
import Home from './pages/Home';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import './App.css';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext'; 
import Login from './pages/Login';
import Signup from "./pages/Signup";
import ProtectedRoute from './components/ProtectedRoute'; // Protected logic

function App() {
  return (
    <AuthProvider> 
      <AuraProvider> 
        <Router>
          <Navbar />
          <div className="app-container">
            <Routes>
              {/* Ye pages sabke liye khule hain */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} /> 
              <Route path="/signup" element={<Signup />} />

              {/* Ye page sirf Login karne ke baad khulega */}
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />

              {/* Ye page sirf Admin hi dekh sakta hai */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuraProvider>
    </AuthProvider>
  );
}

export default App;