import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { saveShippingData, getShippingData } from "../../services/checkoutService";
import { useAuth } from "../../contexts/AuthContext";
import "./Checkout.css";

const initial = getShippingData() || { name: "", email: "", phone: "", address: "", city: "", postalCode: "" };

export default function Checkout() {
  const { isLoggedIn } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  if (!isLoggedIn) return <main className="checkout-page"><div className="checkout-container"><div className="checkout-content"><h1>Checkout</h1><p>Please log in before checkout.</p><Link to="/login" state={{ from: "/checkout" }}>Login</Link></div></div></main>;
  if (!cartItems.length) return <main className="checkout-page"><div className="checkout-container"><div className="checkout-content"><h1>Checkout</h1><p>Your cart is empty.</p><Link to="/shop">Shop Products</Link></div></div></main>;
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); saveShippingData(form); navigate("/checkout/payment"); };
  const field = (key, label) => <div className="checkout-field" key={key}><label htmlFor={`checkout-${key}`}>{label}</label><input id={`checkout-${key}`} required type={key === "email" ? "email" : "text"} value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder={label}/></div>;
  return <main className="checkout-page"><div className="checkout-container">
    <div className="checkout-header"><Link className="checkout-logo" to="/">Furniture</Link></div>
    <div className="checkout-steps"><div className="checkout-step active"><span>1</span> Shipping</div><div className="checkout-step-line"/><div className="checkout-step"><span>2</span> Payment</div><div className="checkout-step-line"/><div className="checkout-step"><span>3</span> Review</div></div>
    <div className="checkout-content"><h1>Shipping Information</h1><form onSubmit={submit} className="checkout-form">
      {field("name", "Full Name")} {field("email", "Email")} {field("phone", "Phone")} {field("address", "Address")}
      <div className="checkout-row">{field("city", "City")}{field("postalCode", "Postal Code")}</div>
      <button className="checkout-continue-button" type="submit">Continue to Payment</button>
    </form></div>
  </div></main>;
}
