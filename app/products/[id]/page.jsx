
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";
import Navbar from "../../../components/Navbar";

export default function EditProduct({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(()=> {
    if (!id) return;
    fetch(`/api/products?q=`).then(r=>r.json()).then(list=> {
      // fetch single product directly:
      const found = list.find(p => String(p.id) === String(id));
      if (found) setProduct(found);
      else fetch(`/api/products/${id}`).then(r=>r.json()).then(setProduct);
    }).catch(()=> {
      fetch(`/api/products/${id}`).then(r=>r.json()).then(setProduct);
    });
  }, [id]);

  async function save(e) {
    e.preventDefault();
    const res = await fetch(`/api/products/${id}`, { method: "PUT", headers: {"content-type":"application/json"}, body: JSON.stringify(product) });
    if (res.ok) { alert("Saved"); router.push("/"); } else { const err = await res.json(); alert(err.error || "Error"); }
  }

  async function del() {
    if (!confirm("Delete product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { alert("Deleted"); router.push("/"); } else { const err = await res.json(); alert(err.error || "Error"); }
  }

  if (!product) return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '16px' }}>Loading product...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{marginBottom: '24px'}}>
          <a href="/" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Products
          </a>
          <h2 style={{ marginTop: '12px', marginBottom: '0px', color: '#f1f5f9', fontSize: '32px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Product
          </h2>
        </div>
        <div className="card" style={{ maxWidth: '600px' }}>
          <form onSubmit={save}>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Product Name</label>
              <input className="search" placeholder="Enter product name" value={product.name} onChange={e=>setProduct({...product, name:e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Price (₹)</label>
              <input className="search" placeholder="0.00" type="number" step="0.01" value={product.price} onChange={e=>setProduct({...product, price:e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Description</label>
              <textarea className="search" placeholder="Enter product description" value={product.description} onChange={e=>setProduct({...product, description:e.target.value})} />
            </div>
            <div style={{display:"flex", gap:8, marginTop:20}}>
              <button className="btn" type="submit" style={{flex: 1}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
              <button className="btn secondary" type="button" onClick={()=>router.push("/")} style={{flex: 1}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Cancel
              </button>
            </div>
            <button className="btn secondary" type="button" onClick={del} style={{width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
