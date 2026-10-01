import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { getWishlist, removeFromWishlist } from "../../services/wishlistService";
import "./Wishlist.css";

export default function Wishlist() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [, refresh] = useState(0);

  useEffect(() => {
    const sync = () => refresh((value) => value + 1);
    window.addEventListener("wishlistUpdated", sync);
    window.addEventListener("authUpdated", sync);
    return () => {
      window.removeEventListener("wishlistUpdated", sync);
      window.removeEventListener("authUpdated", sync);
    };
  }, []);

  const items = isLoggedIn ? getWishlist() : [];

  if (!isLoggedIn) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon"><Heart size={32} /></div>
            <h2>Your Wishlist</h2>
            <p>Log in to view your saved products.</p>
            <Link to="/login" className="wishlist-cart-button">Login</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleAdd = async (product) => {
    try {
      await addToCart(product);
      window.alert("Added to cart");
    } catch (error) {
      if (error.message === "LOGIN_REQUIRED") navigate("/login");
    }
  };

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>Wishlist <span>{items.length} products</span></h1>
        </div>

        {items.length ? (
          <div className="wishlist-grid">
            {items.map((product) => (
              <article className="wishlist-product" key={product.id}>
                <div className="wishlist-image-wrapper">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.img} alt={product.name} />
                  </Link>
                  <button className="wishlist-heart" type="button" onClick={() => removeFromWishlist(product.id)} aria-label="Remove from wishlist">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="wishlist-product-info">
                  <h2>{product.name}</h2>
                  <p className="wishlist-category">{product.category || "Furniture"}</p>
                  <p className="wishlist-price">${Number(product.price || 0).toLocaleString()}</p>
                  <button className="wishlist-cart-button" type="button" onClick={() => handleAdd(product)}>
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon"><Heart size={32} /></div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save products you love and find them here later.</p>
            <Link to="/shop" className="wishlist-cart-button">Browse Products</Link>
          </div>
        )}
      </div>
    </main>
  );
}
