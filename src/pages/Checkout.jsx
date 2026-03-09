import React from 'react';
import { useAura } from '../context/AuraContext'; // Cart data lene ke liye
import { jsPDF } from "jspdf"; // PDF library
import "jspdf-autotable"; // Table plugin
import autoTable from 'jspdf-autotable';
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from '../firebase/config';

function Checkout() {
  const { cart, clearCart } = useAura();
  
  // Cart ka total calculation
  const total = cart.reduce((sum, i) => sum + i.price, 0);

  // PDF Bill banane ka logic
  const downloadBill = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("AURAMART - OFFICIAL INVOICE", 105, 20, { align: "center" });

    // Table Data
    const rows = cart.map(item => [item.name, `INR ${item.price}`]);

    // ASLI FIX: doc.autoTable ki jagah seedha function call
    autoTable(doc, {
        startY: 30,
        head: [['Product Name', 'Price']],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] } // AuraMart Theme Color
    });

    // Total position
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text(`Grand Total: INR ${total}`, 20, finalY + 15);

    // Save File
    doc.save(`AuraMart_Bill_${Date.now()}.pdf`);
};
//   const handlePayment = () => {
//     // Yahan payment gateway trigger hoga
//     alert("Payment Successful! Bill download ho raha hai.");
//     downloadBill(); // Bill generate kiya
//     clearCart(); // Order ke baad cart saaf
//   };
    const handlePayment = async () => {
    alert("Payment Successful! ✅");

    // Har product ka stock database mein 1 kam karein
    cart.forEach(async (product) => {
        const productRef = doc(db, "aura-products", product.id);
        await updateDoc(productRef, {
        stock: increment(-1) // Database mein stock automatic ghati jayega
        });
    });

    downloadBill();
    clearCart();
    };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Checkout Securely 💳</h2>
      <div className="summary">
        <p>Items in Cart: {cart.length}</p>
        <h3>Total Amount: ₹{total}</h3>
      </div>
      
      {cart.length > 0 ? (
        <button onClick={handlePayment} className="pay-btn">Pay Now & Get Bill</button>
      ) : (
        <p>Aapka cart khali hai bhai!</p>
      )}
    </div>
  );
}
export default Checkout;