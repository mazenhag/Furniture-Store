const accountId = () => {
  try {
    const token = localStorage.getItem("token"); if (!token) return "guest";
    const payload = token.split(".")[1]; if (!payload) return "guest";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(normalized).split("").map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(""));
    const data = JSON.parse(json);
    return String(data.sub ?? data.id ?? data.userId ?? "guest");
  } catch { return "guest"; }
};
export const getAccountStorageKey = (prefix) => `${prefix}_${accountId()}`;
export const clearAccountScopedData = () => {
  const id = accountId(); if (id === "guest") return;
  ["furniture_cart", "furniture_wishlist", "furniture_checkout", "furniture_payment"].forEach(prefix => localStorage.removeItem(`${prefix}_${id}`));
  window.dispatchEvent(new Event("cartUpdated")); window.dispatchEvent(new Event("wishlistUpdated"));
};
