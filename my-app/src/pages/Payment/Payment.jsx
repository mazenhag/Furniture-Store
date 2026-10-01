import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { getShippingData, getPaymentData, savePaymentData } from "../../services/checkoutService";
import { useAuth } from "../../contexts/AuthContext";
import "./Payment.css";

export default function Payment() {
  const { isLoggedIn } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const shipping = getShippingData();
  const saved = getPaymentData() || {};
  const [method, setMethod] = useState(saved.method || "cash");
  const [card, setCard] = useState({ number: saved.cardNumber || "", name: saved.cardName || "", expiry: saved.expiry || "", cvv: saved.cvv || "" });
  if (!isLoggedIn) return <main className="payment-page"><div className="payment-container"><div className="payment-content"><h1>Payment</h1><p>Please log in before continuing.</p><Link to="/login">Login</Link></div></div></main>;
  if (!cartItems.length || !shipping) return <main className="payment-page"><div className="payment-container"><div className="payment-content"><h1>Payment</h1><p>Please complete checkout first.</p><Link to="/checkout">Back to Checkout</Link></div></div></main>;
  const setCardValue = (key, value) => setCard((current) => ({ ...current, [key]: value }));
  const continueToReview = () => {
    if (method === "card" && (!card.number || !card.name || !card.expiry || !card.cvv)) return;
    savePaymentData({ method, cardNumber: card.number, cardName: card.name, expiry: card.expiry, cvv: card.cvv });
    navigate("/checkout/review");
  };
  return <main className="payment-page"><div className="payment-container">
    <div className="payment-header"><Link className="payment-logo" to="/">Furniture</Link></div>
    <div className="payment-steps"><div className="payment-step completed"><span>1</span> Shipping</div><div className="payment-step-line completed-line"/><div className="payment-step active"><span>2</span> Payment</div><div className="payment-step-line"/><div className="payment-step"><span>3</span> Review</div></div>
    <div className="payment-content"><h1>Choose Payment Method</h1><div className="payment-form">
      <label className={`payment-option ${method === "cash" ? "selected" : ""}`}><div className="payment-option-header"><input type="radio" checked={method === "cash"} onChange={() => setMethod("cash")} /><span className="custom-radio"/><span className="payment-option-title">Cash on Delivery</span></div></label>
      <div className={`payment-option ${method === "card" ? "selected" : ""}`}>
        <label className="payment-option-header"><input type="radio" checked={method === "card"} onChange={() => setMethod("card")} /><span className="custom-radio"/><span className="payment-option-title">Credit / Debit Card</span><div className="card-brands"><strong>VISA</strong><span className="mastercard-mark"><i/><i/></span></div></label>
        {method === "card" && <div className="card-fields"><div className="payment-field"><label>Card Number</label><div className="card-input-wrapper"><CreditCard size={14}/><input required value={card.number} onChange={(e) => setCardValue("number", e.target.value)} placeholder="1234 5678 9012 3456" inputMode="numeric"/></div></div><div className="payment-field"><label>Cardholder Name</label><input required value={card.name} onChange={(e) => setCardValue("name", e.target.value)} placeholder="Name on card"/></div><div className="card-small-fields"><div className="payment-field"><label>Expiry Date</label><input required value={card.expiry} onChange={(e) => setCardValue("expiry", e.target.value)} placeholder="MM/YY"/></div><div className="payment-field"><label>CVV</label><input required value={card.cvv} onChange={(e) => setCardValue("cvv", e.target.value)} placeholder="123" inputMode="numeric"/></div></div></div>}
      </div>
    </div><button className="payment-continue-button" type="button" onClick={continueToReview}>Continue to Review</button></div>
  </div></main>;
}
