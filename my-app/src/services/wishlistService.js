import { getAccountStorageKey } from "./accountStorage";
const key = () => getAccountStorageKey("furniture_wishlist");
const read = () => { try { return JSON.parse(localStorage.getItem(key()) || "[]"); } catch { return []; } };
const write = items => { localStorage.setItem(key(), JSON.stringify(items)); window.dispatchEvent(new Event("wishlistUpdated")); return items; };
export const getWishlist = () => read();
export const isInWishlist = id => read().some(item => String(item.id) === String(id));
export const addToWishlist = product => { const items = read(); if (!items.some(item => String(item.id) === String(product.id))) write([...items, product]); };
export const removeFromWishlist = id => write(read().filter(item => String(item.id) !== String(id)));
export const toggleWishlist = product => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
