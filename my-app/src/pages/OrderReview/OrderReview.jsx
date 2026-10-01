import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { getPaymentData, getShippingData, clearCheckoutData } from "../../services/checkoutService";
import { createLocalOrder } from "../../services/orderService";
import { useAuth } from "../../contexts/AuthContext";
import "./OrderReview.css";

export default function OrderReview() {
  const { isLoggedIn } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = getShippingData();
  const payment = getPaymentData();

  if (!isLoggedIn) return <main className="order-review-page"><div className="order-review-container"><div className="order-review-content"><h1>Review Order</h1><p>Please log in before continuing.</p><Link to="/login">Login</Link></div></div></main>;
  if (!cartItems.length || !shipping || !payment) return <main className="order-review-page"><div className="order-review-container"><div className="order-review-content"><h1>Review Order</h1><p>Your checkout session is incomplete.</p><Link to="/checkout">Back to Checkout</Link></div></div></main>;

  const place = async () => {
    const order = createLocalOrder({ items: cartItems, shipping, payment });
    await clearCart({ remote: true });
    clearCheckoutData();
    navigate("/thank-you", { state: { orderId: order.id } });
  };

  return (
    <main className="order-review-page">
      <div className="order-review-container">
        <div className="order-review-header"><Link className="order-review-logo" to="/">Furniture</Link></div>
        <div className="order-review-steps">
          <div className="order-review-step completed"><span>1</span> Shipping</div>
          <div className="order-review-step-line completed-line" />
          <div className="order-review-step completed"><span>2</span> Payment</div>
          <div className="order-review-step-line completed-line" />
          <div className="order-review-step active"><span>3</span> Review</div>
        </div>
        <div className="order-review-content">
          <h1>Review Your Order</h1>
          <div className="review-block"><h2>Shipping</h2><p>{shipping.name}</p><p>{shipping.address}, {shipping.city}</p><p>{shipping.email} · {shipping.phone}</p></div>
          <div className="review-block"><h2>Payment</h2><p>{payment.method}</p></div>
          <div className="review-items">
            {cartItems.map((item) => <div className="review-item" key={item.id}><div className="review-item-image"><img src={item.img} alt={item.name} /></div><div className="review-item-info"><h2>{item.name}</h2><span>× {item.quantity}</span></div><p className="review-item-price">${(Number(item.price) * Number(item.quantity)).toLocaleString()}</p></div>)}
          </div>
          <div className="review-total">Total: ${subtotal.toLocaleString()}</div>
          <button className="place-order-button" type="button" onClick={place}>Place Order</button>
        </div>
      </div>
    </main>
  );
}
