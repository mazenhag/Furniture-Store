import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {Heart,Minus,Plus,Truck,RotateCcw,ShieldCheck } from "lucide-react";
import { getProductById } from "../../services/productService";
import {addToWishlist,isInWishlist,removeFromWishlist } from "../../services/wishlistService";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import "./ProductDetails.css";
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    getProductById(id)
      .then((p) => {
        setProduct(p);
        setWish(isInWishlist(p.id));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading)
    return (
      <main className="product-not-found">
        <h1>Loading product...</h1>
      </main>
    );
  if (error || !product)
    return (
      <main className="product-not-found">
        <h1>Product Not Found</h1>
        <p>{error || "This product does not exist."}</p>
        <Link to="/shop">Back to Shop</Link>
      </main>
    );
  const max = Math.max(1, Number(product.countOfPices) || 1);
  const add = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    try {
      await addToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (e) {
      window.alert(e.message);
    }
  };
  const toggle = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    wish ? removeFromWishlist(product.id) : addToWishlist(product);
    setWish((v) => !v);
  };
  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to={`/category/${encodeURIComponent(product.category || "")}`}>
            {product.category}
          </Link>
          <span>›</span>
          <span>{product.name}</span>
        </div>
        <section className="product-main">
          <div className="product-gallery">
            <div className="product-thumbnails">
              <button type="button" className="product-thumbnail active">
                <img src={product.img} alt={product.name} />
              </button>
            </div>
            <div className="product-main-image">
              <img src={product.img} alt={product.name} />
            </div>
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="product-detail-price">
              ${Number(product.price || 0).toLocaleString()}
            </p>
            <p className="product-short-description">{product.description}</p>
            <div className="product-option">
              <h3>Category</h3>
              <p>{product.category || "—"}</p>
            </div>
            <div className="product-option">
              <h3>Quantity</h3>
              <div className="quantity-control">
                <button
                  type="button"
                  disabled={qty <= 1}
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                >
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  disabled={qty >= max}
                  onClick={() => setQty((v) => Math.min(max, v + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <p className="product-availability">
              {Number(product.countOfPices) > 0
                ? `${product.countOfPices} available`
                : "Out of Stock"}
            </p>
            <div className="product-actions">
              <button
                type="button"
                className="add-to-cart-button"
                disabled={Number(product.countOfPices) <= 0}
                onClick={add}
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
              <button
                type="button"
                className={`product-detail-heart ${wish ? "is-wishlisted" : ""}`}
                onClick={toggle}
              >
                <Heart size={19} fill={wish ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="product-features">
              <div className="product-feature">
                <Truck size={16} />
                <span>Free Shipping</span>
              </div>
              <div className="product-feature">
                <RotateCcw size={16} />
                <span>30 Day Return</span>
              </div>
              <div className="product-feature">
                <ShieldCheck size={16} />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </section>
        <section className="product-tabs">
          <div className="product-tab-buttons">
            <button type="button" className="product-tab active">
              Description
            </button>
          </div>
          <div className="product-tab-content">
            <p>{product.description}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
