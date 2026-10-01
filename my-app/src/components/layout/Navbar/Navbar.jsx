import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserRound, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen,setMenuOpen]=useState(false); const [search,setSearch]=useState(""); const navigate=useNavigate(); const {isLoggedIn}=useAuth(); const {totalItems}=useCart();
  const submit=e=>{e.preventDefault(); const q=search.trim(); navigate(q?`/shop?search=${encodeURIComponent(q)}`:"/shop"); setMenuOpen(false);};
  return <header className="navbar"><div className="navbar-container"><Link to="/" className="navbar-logo">Furniture</Link><nav className="navbar-links"><Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/categories">Categories</Link></nav><div className="navbar-actions"><form className="navbar-search" onSubmit={submit}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." aria-label="Search"/><button type="submit" aria-label="Search"><Search size={20}/></button></form><Link to={isLoggedIn?"/profile":"/login"} className="navbar-icon"><UserRound size={21}/></Link><Link to="/wishlist" className="navbar-icon"><Heart size={21}/></Link><Link to="/cart" className="navbar-icon cart-icon"><ShoppingCart size={21}/><span className="cart-count">{totalItems}</span></Link><button className="menu-button" type="button" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button></div></div>{menuOpen&&<nav className="mobile-menu"><Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link><Link to="/shop" onClick={()=>setMenuOpen(false)}>Shop</Link><Link to="/categories" onClick={()=>setMenuOpen(false)}>Categories</Link><Link to="/contact" onClick={()=>setMenuOpen(false)}>Contact</Link></nav>}</header>;
}
