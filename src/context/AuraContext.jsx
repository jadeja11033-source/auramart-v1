import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuraContext = createContext();

export const AuraProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Login user ki jankari
  const [cart, setCart] = useState([]);   // Shopping cart ka data

  // Firebase listener: Jab bhi user login ya logout hoga, ye function chalega
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // User login hai toh details save hongi, varna null
    });
    return () => unsubscribe(); // Memory clean karne ke liye
  }, []);

  // Cart mein item jodne ka logic
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Cart khali karne ka logic (Checkout ke baad)
  const clearCart = () => setCart([]);

  return (
    // Context Provider: Iske andar jo bhi component hoga wo user aur cart ko access kar payega
    <AuraContext.Provider value={{ user, cart, addToCart, clearCart }}>
      {children}
    </AuraContext.Provider>
  );
};

// Custom Hook: Taki har page par asani se data use kar sakein
export const useAura = () => useContext(AuraContext);