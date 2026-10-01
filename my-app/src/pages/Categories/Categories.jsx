import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import "./Categories.css";

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts()
      .then((data) => { if (active) setProducts(Array.isArray(data) ? data : []); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load categories."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))].map((name) => ({
    name,
    image: products.find((product) => product.category === name)?.img,
    count: products.filter((product) => product.category === name).length,
  }));

  return (
    <main className="categories-page">
      <div className="categories-container">
        <section className="categories-hero">
          <div className="categories-hero-overlay">
            <div className="categories-hero-content">
              <h1>Find the right pieces<br className="hero-desktop-break" /> for every room.</h1>
              <p>Explore collections made to bring comfort, character, and timeless style into your home.</p>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <div className="categories-section-header">
            <h2>Shop by Category</h2>
            <div className="categories-section-description">
              <span />
              <p>Curated furniture for every space.</p>
            </div>
          </div>

          {loading ? (
            <div className="categories-empty"><h2>Loading categories...</h2><p>We're getting the latest products from the backend.</p></div>
          ) : error ? (
            <div className="categories-empty"><h2>Categories unavailable</h2><p>{error}</p><Link to="/shop">Open Shop</Link></div>
          ) : categories.length ? (
            <div className="categories-grid">
              {categories.map((category) => (
                <Link className="category-feature-card" key={category.name} to={`/category/${encodeURIComponent(category.name)}`}>
                  <div className="category-feature-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="category-feature-content">
                    <div className="category-feature-info">
                      <div className="category-name-row"><h3>{category.name}</h3></div>
                      <p>{category.count} products</p>
                    </div>
                    <span className="category-arrow"><ArrowRight size={17} /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="categories-empty"><h2>No categories yet</h2><p>Categories will be created automatically from the products returned by the backend.</p></div>
          )}
        </section>

        <section className="categories-cta">
          <div className="categories-cta-content">
            <h2>Ready to refresh your space?</h2>
            <p>Browse the complete furniture collection and discover your next piece.</p>
          </div>
          <Link className="categories-cta-button" to="/shop"><Sparkles size={16} /> Explore Products</Link>
        </section>
      </div>
    </main>
  );
}
