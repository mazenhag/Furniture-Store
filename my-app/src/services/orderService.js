import { getAccountStorageKey } from "./accountStorage";
const key = () => getAccountStorageKey("furniture_orders");
const lastKey = () => getAccountStorageKey("furniture_last_order");
export const getOrders = () => { try { return JSON.parse(localStorage.getItem(key()) || "[]"); } catch { return []; } };
export const createLocalOrder = ({ items, shipping, payment }) => {
  const order = { id: `ORD-${Date.now().toString().slice(-8)}`, date: new Date().toISOString(), status: "Processing", items: items.map(i => ({ ...i })), shipping: { ...shipping }, payment: { method: payment?.method || "cash" }, total: items.reduce((s,i)=>s+Number(i.price||0)*Number(i.quantity||0),0) };
  localStorage.setItem(key(), JSON.stringify([order, ...getOrders()])); localStorage.setItem(lastKey(), JSON.stringify(order)); window.dispatchEvent(new Event("ordersUpdated")); return order;
};
export const getLastOrder = () => { try { return JSON.parse(localStorage.getItem(lastKey()) || "null"); } catch { return null; } };
export const cancelOrder = id => { const orders = getOrders().map(o => o.id === id && ["Processing","Shipped"].includes(o.status) ? {...o,status:"Canceled",canceledAt:new Date().toISOString()} : o); localStorage.setItem(key(),JSON.stringify(orders)); window.dispatchEvent(new Event("ordersUpdated")); return orders; };
