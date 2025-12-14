
"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TopSellersModal from "../components/TopSellersModal";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [msg, setMsg] = useState("");
  const [showTopSellers, setShowTopSellers] = useState(false);
  const [topSellersData, setTopSellersData] = useState([]);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    try { setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]")); } catch { setFavorites([]); }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  async function fetchProducts(search) {
    const url = search ? `/api/products?q=${encodeURIComponent(search)}` : "/api/products";
    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
  }

  async function addProduct(e) {
    e.preventDefault();
    if (!form.name || form.price === "") return alert("Provide name and price");
    const res = await fetch("/api/products", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ name: form.name, price: Number(form.price), description: form.description }) });
    if (res.ok) {
      setForm({ name: "", price: "", description: "" });
      fetchProducts();
      setMsg("Product added");
      setTimeout(()=>setMsg(""),2000);
    } else {
      const err = await res.json();
      alert(err.error || "Error");
    }
  }

  function toggleFav(id) {
    setFavorites(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  }

  async function fetchTopSellers() {
    const res = await fetch('/api/report/top-sellers');
    const data = await res.json();
    setTopSellersData(data);
    setShowTopSellers(true);
  }

  
  useEffect(() => {
    if (!showTopSellers) return;
    (async () => {
      try { await fetchTopSellers(); } catch {}
    })();
    const id = setInterval(() => { fetchTopSellers(); }, 10000);
    return () => clearInterval(id);
  }, [showTopSellers]);

  async function sell(p) {
    const qty = Number(prompt(`Quantity to sell for ${p.name}`, "1"));
    if (!qty || qty <= 0) return;
    const res = await fetch("/api/orders", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ items: [{ product_id: p.id, quantity: qty, price: p.price }] }) });
    if (res.ok) {
      alert("Sale recorded");
      fetchProducts();
      if (showTopSellers) {
        fetchTopSellers();
      }
    } else {
      const err = await res.json();
      alert(err.error || "Error saving order");
    }
  }

  return (
    <>
      <Navbar />
      <TopSellersModal isOpen={showTopSellers} onClose={() => setShowTopSellers(false)} data={topSellersData} />
      <div className="container">
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>Search Products</label>
            <input className="search" placeholder="Search by product name..." value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') fetchProducts(q) }} />
          </div>
          <div style={{display:"flex", gap:12, marginTop:16, flexWrap: 'wrap'}}>
            <button className="btn" onClick={()=>fetchProducts(q)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
            <button className="btn secondary" onClick={()=>{ setQ(""); fetchProducts(); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Clear
            </button>
            <button className="btn" onClick={fetchTopSellers}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              Top Sellers
            </button>
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns: "1fr 350px", gap:24, alignItems:"flex-start"}}>
          <div>
            {products.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ fontSize: '16px', color: 'var(--muted)' }}>No products found. Add one to get started!</p>
              </div>
            ) : (
              <div>
                <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#f1f5f9' }}>Products ({products.length})</h3>
                <div className="product-grid">
                  {products && products.map(p => (
                    <div key={p.id} className="card product-card">
                      <div className="heart" onClick={()=>toggleFav(p.id)}>
                        {favorites.includes(p.id) ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        )}
                      </div>
                      <h3>{p.name}</h3>
                      <div style={{fontWeight:700, fontSize: '20px', color: '#60a5fa'}}>₹{Number(p.price).toFixed(2)}</div>
                      <p style={{marginTop:12, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', margin: 0}}>{p.description}</p>
                      <div style={{display:"flex", gap:8, marginTop:16}}>
                        <button className="btn" style={{flex: 1}} onClick={()=>sell(p)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          Sell
                        </button>
                        <a className="btn secondary" style={{flex: 1, textDecoration: 'none', textAlign: 'center'}} href={`/products/${p.id}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ position: 'sticky', top: '20px' }}>
              <h4 style={{ marginTop: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Add Product
              </h4>
              {msg && <div style={{ padding: '10px', background: '#10b981', color: 'white', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>{msg}</div>}
              <form onSubmit={addProduct}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Product Name</label>
                  <input className="search" placeholder="Enter product name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Price (₹)</label>
                  <input className="search" placeholder="0.00" type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Description</label>
                  <textarea className="search" placeholder="Enter product description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
                </div>
                <button className="btn" type="submit" style={{marginTop: 8}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
