import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { getLastOrder } from "../../services/orderService";
import "./ThankYou.css";

export default function ThankYou() {
  const order = getLastOrder();
  return (
    <main className="thank-you-page">
      <div className="thank-you-container">
        <div className="thank-you-header"><Link className="thank-you-logo" to="/">Furniture</Link></div>
        <div className="thank-you-content">
          <div className="thank-you-icon"><Check size={38} /></div>
          <h1>Thank You!</h1>
          <p className="thank-you-message">Your order has been placed successfully.</p>
          {order && <>
            <div className="thank-you-order"><span>Order Number</span><strong>{order.id}</strong></div>
            <p className="thank-you-email">A local order record was created for <strong>{order.shipping?.email || "your account"}</strong>.</p>
          </>}
          <div className="thank-you-actions">
            <Link className="continue-shopping-button" to="/my-orders">View My Orders</Link>
            <Link className="continue-shopping-button" to="/shop">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
