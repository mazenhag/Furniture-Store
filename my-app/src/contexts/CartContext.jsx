import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getAccountStorageKey } from "../services/accountStorage";
import { addCartProduct, increaseCartProduct, decreaseCartProduct, clearRemoteCart } from "../services/cartService";
import { isAuthenticated } from "../services/authService";

const CartContext = createContext(null);
const read = () => { try { return JSON.parse(localStorage.getItem(getAccountStorageKey("furniture_cart")) || "[]"); } catch { return []; } };
const save = items => { localStorage.setItem(getAccountStorageKey("furniture_cart"), JSON.stringify(items)); window.dispatchEvent(new Event("cartUpdated")); };

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(read);
  const addingIds = useRef(new Set());
  useEffect(() => { const sync = () => setCartItems(read()); window.addEventListener("authUpdated", sync); window.addEventListener("cartUpdated", sync); return () => { window.removeEventListener("authUpdated", sync); window.removeEventListener("cartUpdated", sync); }; }, []);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated()) throw new Error("LOGIN_REQUIRED");
    const key = String(product.id);
    if (addingIds.current.has(key)) return;
    addingIds.current.add(key);
    try {
      await addCartProduct(product.id);
      for (let i = 1; i < quantity; i += 1) await increaseCartProduct(product.id);
      const current = read();
      const existing = current.find((item) => String(item.id) === key);
      const next = existing
        ? current.map((item) => String(item.id) === key ? { ...item, ...product, quantity: Number(item.quantity || 0) + quantity } : item)
        : [...current, { ...product, quantity }];
      setCartItems(next);
      save(next);
    } finally {
      addingIds.current.delete(key);
    }
  };

  const increaseQuantity = async id => { if (!isAuthenticated()) throw new Error("LOGIN_REQUIRED"); await increaseCartProduct(id); const next=read().map(i=>String(i.id)===String(id)?{...i,quantity:Number(i.quantity||0)+1}:i); setCartItems(next); save(next); };
  const decreaseQuantity = async id => { if (!isAuthenticated()) throw new Error("LOGIN_REQUIRED"); const item=read().find(i=>String(i.id)===String(id)); if(!item) return; await decreaseCartProduct(id); const next=item.quantity<=1?read().filter(i=>String(i.id)!==String(id)):read().map(i=>String(i.id)===String(id)?{...i,quantity:Number(i.quantity||0)-1}:i); setCartItems(next); save(next); };
  const removeFromCart = id => { setCartItems(prev=>{const next=prev.filter(i=>String(i.id)!==String(id));save(next);return next;}); };
  const clearCart = async ({ remote = true } = {}) => { if(remote && isAuthenticated()) await clearRemoteCart(); setCartItems([]); save([]); };

  const totalItems = useMemo(()=>cartItems.reduce((s,i)=>s+Number(i.quantity||0),0),[cartItems]);
  const subtotal = useMemo(()=>cartItems.reduce((s,i)=>s+Number(i.price||0)*Number(i.quantity||0),0),[cartItems]);
  return <CartContext.Provider value={{cartItems,totalItems,subtotal,addToCart,increaseQuantity,decreaseQuantity,removeFromCart,clearCart}}>{children}</CartContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => { const c=useContext(CartContext); if(!c) throw new Error("useCart must be used inside CartProvider"); return c; };
