import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useAura } from '../context/AuraContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAura();

  // 1. Database se data lana
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "aura-products"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
        setFilteredItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. ASLI MAGIC: Search aur Category dono ko ek saath filter karna
  useEffect(() => {
    let result = products;

    // Pehle Category filter karo
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Phir Search term filter karo
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [searchTerm, activeCategory, products]); // In teeno mein se kuch bhi badle toh list update hogi

  if (loading) return <div className="loader">AuraMart Loading...</div>;

  return (
    <div className="container">
      
      {/* SEARCH BAR SECTION */}
      <div className="search-section" style={{ textAlign: 'center', marginTop: '30px' }}>
        <input 
          type="text" 
          placeholder="Product dhoondo (e.g. iPhone)... 🔍" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '80%',
            maxWidth: '500px',
            padding: '12px 25px',
            borderRadius: '30px',
            border: '2px solid #6366f1',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
          }}
        />
      </div>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="filter-bar" style={{ textAlign: 'center', margin: '20px 0' }}>
        {['All', 'Mobile Accessories', 'Laptop Accessories', 'Audio & Sound'].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)} // Sirf category set karni hai, useEffect baki handle kar lega
            style={{
              margin: '5px',
              padding: '10px 20px',
              width: 'auto',
              borderRadius: '20px',
              background: activeCategory === cat ? '#6366f1' : '#f1f5f9',
              color: activeCategory === cat ? 'white' : '#1e293b',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
            <h3>Bhai, kuch nahi mila! 😅</h3>
            <p>Thoda alag naam try karo ya category badlo.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="product-card">
              <img src={item.image} alt={item.name} />
              <div className="card-info">
                <small style={{ color: '#6366f1', fontWeight: 'bold' }}>{item.category}</small>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                
                {/* Stock Logic */}
                {item.stock > 0 ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'green', fontSize: '12px', fontWeight: 'bold' }}>
                      Stock: {item.stock} available
                    </p>
                    <button onClick={() => addToCart(item)}>Bag mein dalo</button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'red', fontSize: '12px', fontWeight: 'bold' }}>
                      Sold Out
                    </p>
                    <button disabled style={{ background: '#ccc', cursor: 'not-allowed' }}>
                      Out of Stock
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;