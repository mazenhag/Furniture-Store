import { getAccountStorageKey } from "./accountStorage";
const read = prefix => { try { return JSON.parse(localStorage.getItem(getAccountStorageKey(prefix)) || "null"); } catch { return null; } };
const write = (prefix, value) => localStorage.setItem(getAccountStorageKey(prefix), JSON.stringify(value));
export const getShippingData = () => read("furniture_checkout");
export const saveShippingData = value => write("furniture_checkout", value);
export const getPaymentData = () => read("furniture_payment");
export const savePaymentData = value => write("furniture_payment", value);
export const clearCheckoutData = () => { localStorage.removeItem(getAccountStorageKey("furniture_checkout")); localStorage.removeItem(getAccountStorageKey("furniture_payment")); };
