import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard/ProductCard";
import { getProducts } from "../../services/productService";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const name = decodeURIComponent(categoryName || "");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let active = true;
    getProducts()
      .then((data) => {
        if (active) setAllProducts(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load products.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(allProducts.map((product) => product.category).filter(Boolean))],
    [allProducts]
  );

  const products = useMemo(() => {
    let result = allProducts.filter(
      (product) => String(product.category || "").toLowerCase() === name.toLowerCase()
    );
    if (sort === "price-low") result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-high") result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name") result = [...result].sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return result;
  }, [allProducts, name, sort]);

  return (
    <main className="category-products-page">
      <div className="category-products-container">
        <div className="category-breadcrumb"><Link to="/categories">Categories</Link><span>/</span><span>{name}</span></div>

        <div className="category-layout">
          <aside className="category-sidebar">
            <h2>Categories</h2>
            <nav className="category-list">
              {categories.map((category) => <Link key={category} className={`category-link ${category.toLowerCase() === name.toLowerCase() ? "active" : ""}`} to={`/category/${encodeURIComponent(category)}`}>{category}</Link>)}
            </nav>
          </aside>

          <section className="category-products">
            <div className="category-products-header">
              <h1>{name}</h1>
              <p>{products.length} products</p>
            </div>

            <div className="sort-section">
              <div className="sort-select-wrapper">
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </div>

            {loading ? <div className="category-products-empty"><h2>Loading products...</h2><p>We're getting products from the backend.</p></div>
              : error ? <div className="category-products-empty"><h2>Products unavailable</h2><p>{error}</p><Link to="/shop">Shop all products</Link></div>
              : products.length ? <div className="products-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
              : <div className="category-products-empty"><h2>No products in this category</h2><p>Try another category.</p><Link to="/shop">Shop all products</Link></div>}
          </section>
        </div>
      </div>
    </main>
  );
}
