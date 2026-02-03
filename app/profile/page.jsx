"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("user");
    // Dispatch auth change event for Navbar to update
    window.dispatchEvent(new Event("authChange"));
    router.replace("/login");
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="profile-loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="profile-page">
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-large-avatar">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h1>{user.name || "User"}</h1>
              <p>{user.email}</p>
            </div>

            <div className="profile-card-body">
              <div className="profile-info-section">
                <h3>Account Information</h3>
                <div className="profile-info-row">
                  <span className="label">Full Name</span>
                  <span className="value">{user.name || "Not set"}</span>
                </div>
                <div className="profile-info-row">
                  <span className="label">Email</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="profile-info-row">
                  <span className="label">Member Since</span>
                  <span className="value">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn danger" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
