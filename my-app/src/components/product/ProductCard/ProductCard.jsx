import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";
import { useAuth } from "../../../contexts/AuthContext";
import {addToWishlist,isInWishlist,removeFromWishlist,} from "../../../services/wishlistService";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const [wish, setWish] = useState(() => isInWishlist(product.id));
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const toggleWish = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    if (wish) removeFromWishlist(product.id);
    else addToWishlist(product);
    setWish(!wish);
  };
  const add = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    try {
      await addToCart(product);
    } catch (e) {
      window.alert(e.message);
    }
  };
  return (
    <article className="product-card">
      <div className="product-card-image">
        <Link to={`/product/${product.id}`}>
          <img src={product.img} alt={product.name} />
        </Link>
        <button
          type="button"
          className={`product-card-wishlist ${wish ? "is-wishlisted" : ""}`}
          onClick={toggleWish}
        >
          <Heart size={19} fill={wish ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-card-content">
        <Link to={`/product/${product.id}`} className="product-card-name">
          {product.name}
        </Link>
        <p className="product-card-price">
          ${Number(product.price || 0).toLocaleString()}
        </p>
        <button type="button" className="product-card-cart" onClick={add}>
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
