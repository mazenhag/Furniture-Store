import { useEffect, useState } from "react";
import {
  Truck,
  ShieldCheck,
  Headphones,
  Leaf,
  ArrowLeft,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import {
  addToWishlist,
  isInWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";
import { useAuth } from "../../contexts/AuthContext";
import "./Home.css";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    getProducts()
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ].map((name) => ({
    name,
    image: products.find((p) => p.category === name)?.img,
  }));
  const toggle = (p) => {
    if (!isLoggedIn) return;
    isInWishlist(p.id) ? removeFromWishlist(p.id) : addToWishlist(p);
  };
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Make Your
              <br />
              Home A<br />
              Better Place
            </h1>
            <p>
              Modern furniture for
              <br />a more comfortable life.
            </p>
            <Link to="/shop" className="hero-button">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      <section className="home-benefits">
        <div className="benefit-item">
          <div className="benefit-icon">
            <Truck size={21} />
          </div>
          <h3>Free Shipping</h3>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">
            <ShieldCheck size={21} />
          </div>
          <h3>Secure Payment</h3>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">
            <Headphones size={21} />
          </div>
          <h3>Easy Returns</h3>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">
            <Leaf size={21} />
          </div>
          <h3>24/7 Support</h3>
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <h2>Shop by Category</h2>
        </div>
        {categories.length ? (
          <div className="category-grid">
            {categories.map((c) => (
              <Link
                key={c.name}
                to={`/category/${encodeURIComponent(c.name)}`}
                className="category-card"
              >
                <div className="category-image">
                  <img src={c.image} alt={c.name} />
                </div>
                <h3>{c.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="home-empty">
            Categories will appear when products are available.
          </p>
        )}
      </section>
      <section className="home-section">
        <div className="section-heading featured-heading">
          <h2>Featured Products</h2>
          <div className="product-arrows">
            <button
              type="button"
              onClick={() => setStart((v) => Math.max(0, v - 1))}
              disabled={!start}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() =>
                setStart((v) =>
                  Math.min(Math.max(0, products.length - 4), v + 1),
                )
              }
              disabled={start + 4 >= products.length}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length ? (
          <div className="featured-products">
            {products.slice(start, start + 4).map((p) => (
              <article className="featured-product-card" key={p.id}>
                <div className="featured-image">
                  <Link to={`/product/${p.id}`} className="product-image-link">
                    <img src={p.img} alt={p.name} />
                  </Link>
                  <button
                    type="button"
                    className={`product-heart ${isInWishlist(p.id) ? "is-wishlisted" : ""}`}
                    onClick={() => toggle(p)}
                  >
                    <Heart
                      size={17}
                      fill={isInWishlist(p.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <Link to={`/product/${p.id}`} className="product-name">
                  {p.name}
                </Link>
                <p className="product-price">
                  ${Number(p.price || 0).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="home-empty">
            Products will appear here when the backend is populated.
          </p>
        )}
      </section>
    </main>
  );
}
