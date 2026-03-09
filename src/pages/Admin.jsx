import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config'; 
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [item, setItem] = useState({ 
        name: '', price: '', img: '', category: 'Mobile Accessories', stock: '' 
    });
    const [products, setProducts] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "aura-products"));
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(items);
        } catch (err) { console.error("Fetch error:", err); }
    };

    useEffect(() => {
        if (user && isAdmin) fetchProducts();
    }, [user, isAdmin]);

    // 🛡️ Security Logic
    if (authLoading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Security Check... 🛡️</div>;

    if (!user || !isAdmin) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Access Denied! 🚫</h2>
                <p>Bhai, ye area sirf Shop Owner (Admin) ke liye hai.</p>
                <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Home par wapas jao
                </button>
            </div>
        );
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploadLoading(true);
        try {
            await addDoc(collection(db, "aura-products"), {
                ...item,
                price: Number(item.price),
                stock: Number(item.stock),
                image: item.img,
                createdAt: new Date()
            });
            alert("Product Live! 🚀");
            setItem({ name: '', price: '', img: '', category: 'Mobile Accessories', stock: '' });
            fetchProducts(); 
        } catch (err) { alert("Error: " + err.message); }
        finally { setUploadLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete karein?")) {
            await deleteDoc(doc(db, "aura-products", id));
            fetchProducts();
        }
    };

    return (
        <div className="admin-container" style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div className="admin-box" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', color: '#6366f1' }}>AuraMart Inventory 🛠️</h2>
                <form onSubmit={handleUpload}>
                    <input type="text" placeholder="Product Name" value={item.name} onChange={(e) => setItem({...item, name: e.target.value})} required />
                    <input type="number" placeholder="Price (₹)" value={item.price} onChange={(e) => setItem({...item, price: e.target.value})} required />
                    <input type="number" placeholder="Stock" value={item.stock} onChange={(e) => setItem({...item, stock: e.target.value})} required />
                    <input type="text" placeholder="Image URL" value={item.img} onChange={(e) => setItem({...item, img: e.target.value})} required />
                    <select value={item.category} onChange={(e) => setItem({...item, category: e.target.value})} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <option value="Mobile Accessories">Mobile Accessories</option>
                        <option value="Laptop Accessories">Laptop Accessories</option>
                        <option value="Audio & Sound">Audio & Sound</option>
                    </select>
                    <button type="submit" disabled={uploadLoading}>{uploadLoading ? "Uploading..." : "Add Product"}</button>
                </form>
            </div>

            <div className="inventory-section" style={{ marginTop: '50px' }}>
                <h3>Stock List ({products.length})</h3>
                {products.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', marginBottom: '10px', borderRadius: '10px', borderLeft: '5px solid #6366f1' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <img src={p.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                            <div>
                                <h4 style={{ margin: 0 }}>{p.name}</h4>
                                <small>₹{p.price} | Stock: {p.stock}</small>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(p.id)} style={{ background: '#ef4444', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin;