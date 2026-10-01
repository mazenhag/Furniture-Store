import { apiFetch, authHeaders } from "./api";
export const addCartProduct = (productId) => apiFetch("/api/Cart", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
export const increaseCartProduct = (productId) => apiFetch(`/api/Cart/${productId}/increase`, { method: "PUT", headers: authHeaders() });
export const decreaseCartProduct = (productId) => apiFetch(`/api/Cart/${productId}/decrease`, { method: "PUT", headers: authHeaders() });
export const clearRemoteCart = () => apiFetch("/api/Cart", { method: "DELETE", headers: authHeaders() });
