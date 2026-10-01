import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUserProducts, createProduct, updateProduct, deleteProduct, imageUrlToFile } from "../../services/productService";
import { useAuth } from "../../contexts/AuthContext";
import "./MyProducts.css";

const empty = { name: "", description: "", price: "", quantity: "", category: "", image: null, imageUrl: "", originalImageUrl: "" };

export default function MyProducts() {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const load = () => getCurrentUserProducts().then((data) => setItems(Array.isArray(data) ? data : [])).catch((e) => setError(e.message));
  useEffect(() => { if (isLoggedIn) load(); }, [isLoggedIn]);
  if (!isLoggedIn) return <main className="my-products-page"><div className="my-products-container"><h1>My Products</h1><p>Log in to manage your products.</p><Link to="/login">Login</Link></div></main>;
  const startEdit = (product) => { setEditing(product.id); setError(""); setForm({ name: product.name || "", description: product.description || "", price: product.price ?? "", quantity: product.countOfPices ?? "", category: product.category || "", image: null, imageUrl: product.img || "", originalImageUrl: product.img || "" }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const reset = () => { setEditing(null); setForm(empty); setError(""); };
  const submit = async (event) => {
    event.preventDefault(); setError(""); setSaving(true);
    try {
      let image = form.image;
      const currentImageUrl = (form.imageUrl || "").trim();
      const originalImageUrl = (form.originalImageUrl || "").trim();
      // During an update, the existing backend image URL is only a reference to
      // the current image. Do not fetch it again: that can trigger CORS and cause
      // a misleading "Failed to fetch" before the PUT request is even sent.
      const imageChangedByUrl = currentImageUrl && currentImageUrl !== originalImageUrl;
      if (!image && imageChangedByUrl) image = await imageUrlToFile(currentImageUrl, `${form.name || "product"}.jpg`);
      if (!editing && !image) throw new Error("Please add an image file or a public image URL.");
      await (editing ? updateProduct({ id: editing, ...form, image }) : createProduct({ ...form, image }));
      reset(); await load();
    } catch (err) { setError(err.message || "Unable to save product."); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (!window.confirm("Delete this product?")) return; try { await deleteProduct(id); await load(); } catch (err) { setError(err.message || "Unable to delete product."); } };
  return <main className="my-products-page"><div className="my-products-container">
    <div className="my-products-header"><div><p>SELLER AREA</p><h1>My Products</h1></div><span>{items.length} products</span></div>
    <form className="product-admin-form" onSubmit={submit}><h2>{editing ? "Update Product" : "Add Product"}</h2>
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
      <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/>
      <div className="admin-row"><input required type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}/><input required type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}/><input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}/></div>
      <div className="image-input-group"><label>Product Image</label><input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}/><span>or</span><input type="url" placeholder="Paste a public image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}/>{form.imageUrl && <img className="image-url-preview" src={form.imageUrl} alt="Preview" onError={(e) => { e.currentTarget.style.display = "none"; }} />}</div>
      {editing && form.imageUrl && <p className="image-help">The current image can stay as-is, or paste a new URL/upload a new file.</p>}
      {error && <p className="form-error">{error}</p>}
      <div><button disabled={saving}>{saving ? "Saving..." : editing ? "Update Product" : "Add Product"}</button>{editing && <button type="button" onClick={reset}>Cancel</button>}</div>
    </form>
    <div className="my-products-grid">{items.map((product) => <article key={product.id} className="admin-product-card"><img src={product.img} alt={product.name}/><div><h3>{product.name}</h3><p>${Number(product.price || 0).toLocaleString()} · {product.countOfPices} available</p><p>{product.category}</p><div><button type="button" onClick={() => startEdit(product)}>Update Product</button><button type="button" onClick={() => remove(product.id)}>Remove</button></div></div></article>)}</div>
  </div></main>;
}
