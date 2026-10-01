import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ClipboardList, X } from "lucide-react";
import { getOrders, cancelOrder } from "../../services/orderService";
import { useAuth } from "../../contexts/AuthContext";
import "./MyOrders.css";

export default function MyOrders() {
  const { isLoggedIn } = useAuth();
  const [, refresh] = useState(0);
  const [filter, setFilter] = useState("All");
  const [openOrder, setOpenOrder] = useState(null);

  useEffect(() => {
    const sync = () => refresh((value) => value + 1);
    window.addEventListener("ordersUpdated", sync);
    return () => window.removeEventListener("ordersUpdated", sync);
  }, []);

  const orders = isLoggedIn ? getOrders() : [];
  const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

  if (!isLoggedIn) {
    return (
      <main className="my-orders-page">
        <div className="my-orders-container">
          <div className="my-orders-header">
            <p>ACCOUNT</p>
            <h1>My Orders</h1>
          </div>
          <div className="orders-empty">
            <ClipboardList size={34} />
            <h2>Login to view your orders</h2>
            <p>Your local order history is connected to your account.</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <div className="my-orders-container">
        <div className="my-orders-header">
          <p>ACCOUNT</p>
          <h1>My Orders</h1>
        </div>

        <div className="order-filters">
          {["All", "Processing", "Shipped", "Delivered", "Canceled"].map((item) => (
            <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>

        {filteredOrders.length ? (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const isOpen = openOrder === order.id;
              return (
                <article className="order-card" key={order.id}>
                  <div className="order-info">
                    <h2>{order.id}</h2>
                    <p>{new Date(order.date).toLocaleDateString()}</p>
                  </div>

                  <div className="order-status">
                    <span className={`status-badge ${String(order.status).toLowerCase().replace(/\s+/g, "-")}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-summary">
                    <p>{order.items?.length || 0} product{order.items?.length === 1 ? "" : "s"}</p>
                    <strong>${Number(order.total || 0).toLocaleString()}</strong>
                  </div>

                  <div className="order-actions">
                    <button type="button" className="view-order" onClick={() => setOpenOrder(isOpen ? null : order.id)}>
                      {isOpen ? "Hide" : "View Details"}
                      <ChevronRight size={14} />
                    </button>
                    {["Processing", "Shipped"].includes(order.status) && (
                      <button type="button" className="cancel-order" onClick={() => cancelOrder(order.id)}>
                        <X size={14} />
                        Cancel
                      </button>
                    )}
                  </div>

                  {isOpen && (
                    <div className="order-details-panel">
                      <div>
                        <strong>Items</strong>
                        {order.items?.map((item) => (
                          <p key={item.id}>{item.name} × {item.quantity}</p>
                        ))}
                      </div>
                      <div>
                        <strong>Total</strong>
                        <p>${Number(order.total || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <strong>Status</strong>
                        <p>{order.status}</p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="orders-empty">
            <ClipboardList size={34} />
            <h2>No orders yet</h2>
            <p>Orders are stored locally because the current backend documentation has no Orders API.</p>
            <Link to="/shop">Start Shopping</Link>
          </div>
        )}
      </div>
    </main>
  );
}
