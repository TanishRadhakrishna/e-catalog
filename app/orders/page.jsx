// app/orders/page.jsx
"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
      else throw new Error(data.error || "Failed to load orders");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function deleteOne(id) {
    if (!confirm("Delete this order?")) return;
    const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      setOrders(prev => prev.filter(o => o.id !== id));
    } else {
      alert(data.error || "Failed to delete order");
    }
  }

  async function deleteAll() {
    if (!confirm("Delete ALL orders? This cannot be undone.")) return;
    const res = await fetch(`/api/orders?all=true`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      setOrders([]);
    } else {
      alert(data.error || "Failed to delete all orders");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Orders</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn secondary" onClick={load}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }}>
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15"></path>
              </svg>
              Refresh
            </button>
            <button className="btn" onClick={deleteAll} style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }}>
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete All
            </button>
          </div>
        </div>

        <div className="card">
          {loading ? (
            <p style={{ color: 'var(--muted)' }}>Loading orders...</p>
          ) : error ? (
            <p style={{ color: '#fca5a5' }}>{error}</p>
          ) : orders.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No orders found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Quantity</th>
                    <th style={{ padding: '10px' }}>Total Price</th>
                    <th style={{ padding: '10px' }}>Date</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                      <td style={{ padding: '10px' }}>{o.id}</td>
                      <td style={{ padding: '10px' }}>{o.product_name}</td>
                      <td style={{ padding: '10px' }}>{o.quantity}</td>
                      <td style={{ padding: '10px' }}>₹{Number(o.total_price).toFixed(2)}</td>
                      <td style={{ padding: '10px' }}>{new Date(o.created_at).toLocaleString()}</td>
                      <td style={{ padding: '10px' }}>
                        <button className="btn secondary" onClick={() => deleteOne(o.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
