"use client";

export default function TopSellersModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Top Selling Products</h2>
          <button className="modal-close" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {!data || data.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ margin: "0 auto", opacity: 0.3 }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p
                style={{
                  color: "var(--muted)",
                  marginTop: "16px",
                  fontSize: "14px",
                }}
              >
                No sales data available yet
              </p>
            </div>
          ) : (
            <div className="top-sellers-list">
              {data.map((item, index) => (
                <div key={index} className="top-seller-item">
                  <div className="top-seller-rank">
                    <span className={`rank-badge rank-${index + 1}`}>
                      #{index + 1}
                    </span>
                  </div>

                  <div className="top-seller-info">
                    <h3>{item.name}</h3>

                    <div className="top-seller-stats">
                      <div className="stat-item">
                        <span>
                          Quantity:{" "}
                          <strong>{item.quantity_sold}</strong>
                        </span>
                      </div>

                      <div className="stat-item">
                        <span>
                          Revenue:{" "}
                          <strong>
                            ₹{Number(item.revenue).toFixed(2)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
