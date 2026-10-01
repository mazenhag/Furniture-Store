import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, ClipboardList, Heart, Settings, LogOut, Camera } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getCurrentUserProducts } from "../../services/productService";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, authLoading } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;
    getCurrentUserProducts()
      .then((products) => setCount(Array.isArray(products) ? products.length : 0))
      .catch(() => setCount(0));
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (authLoading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <section className="profile-content">
            <p>Loading profile...</p>
          </section>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <section className="profile-content">
            <h1>My Profile</h1>
            <p>You need to log in first.</p>
            <Link to="/login" className="edit-profile-button">Login</Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <button type="button" className="profile-menu-item active">
            <UserRound size={19} />
            <span>My Profile</span>
          </button>

          <Link to="/my-orders" className="profile-menu-item">
            <ClipboardList size={19} />
            <span>My Orders</span>
          </Link>


          <Link to="/wishlist" className="profile-menu-item">
            <Heart size={19} />
            <span>My Wishlist</span>
          </Link>

          <Link to="/my-products" className="profile-menu-item">
            <Settings size={19} />
            <span>My Products</span>
          </Link>

          <button type="button" className="profile-menu-item logout" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </aside>

        <section className="profile-content">
          <h1>My Profile</h1>

          <div className="profile-user">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <UserRound size={45} />
              </div>
              <button type="button" className="change-avatar" aria-label="Change profile picture">
                <Camera size={13} />
              </button>
            </div>

            <div className="profile-user-info">
              <h2>{user?.name || "Account"}</h2>
              <p>{user?.email || ""}</p>
            </div>

            <button type="button" className="edit-profile-button">
              Edit
            </button>
          </div>

          <div className="profile-form">
            <div className="profile-field">
              <label htmlFor="profile-name">Name</label>
              <input id="profile-name" type="text" value={user?.name || ""} readOnly />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" type="email" value={user?.email || ""} readOnly />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-id">User ID</label>
              <input id="profile-id" type="text" value={user?.id ?? ""} readOnly />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-product-count">My Products</label>
              <input id="profile-product-count" type="text" value={count} readOnly />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
