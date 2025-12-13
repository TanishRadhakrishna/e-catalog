// app/favorites/page.jsx
"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(()=> {
    try { setFavorites(JSON.parse(localStorage.getItem("favorites")||"[]")); } catch { setFavorites([]); }
  }, []);

  useEffect(()=> {
    if (favorites.length === 0) return setProducts([]);
    fetch("/api/products").then(r=>r.json()).then(all => setProducts(all.filter(p=>favorites.includes(p.id))));
  }, [favorites]);

  function toggleFav(id) {
    const f = favorites.includes(id) ? favorites.filter(x=>x!==id) : [...favorites, id];
    setFavorites(f); localStorage.setItem("favorites", JSON.stringify(f));
    setProducts(prev => prev.filter(p => f.includes(p.id)));
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{marginBottom: '24px'}}>
          <h2 style={{ marginTop: 0, marginBottom: '8px', color: '#f1f5f9', fontSize: '32px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Your Favorites
          </h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>View and manage your favorite products</p>
        </div>
        {products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h3 style={{ color: '#f1f5f9', marginBottom: '8px' }}>No Favorites Yet</h3>
            <p style={{ color: 'var(--muted)' }}>Start adding products to your favorites to see them here!</p>
            <a href="/" className="btn" style={{ marginTop: '16px', display: 'inline-block', textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Products
            </a>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>You have {products.length} favorite product{products.length !== 1 ? 's' : ''}</p>
            <div className="product-grid">
              {products.map(p => (
                <div key={p.id} className="card product-card">
                  <div className="heart" onClick={()=>toggleFav(p.id)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <h3>{p.name}</h3>
                  <div style={{fontWeight:700, fontSize: '20px', color: '#60a5fa'}}>₹{Number(p.price).toFixed(2)}</div>
                  <p style={{marginTop:12, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', margin: 0}}>{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
