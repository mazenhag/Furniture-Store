import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Categories from "./pages/Categories/Categories";
import CategoryProducts from "./pages/CategoryProducts/CategoryProducts";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Contact from "./pages/contact/Contact";
import Checkout from "./pages/Checkout/Checkout";
import Payment from "./pages/Payment/Payment";
import OrderReview from "./pages/OrderReview/OrderReview";
import ThankYou from "./pages/ThankYou/ThankYou";
import MyOrders from "./pages/MyOrders/MyOrders";
import MyProducts from "./pages/MyProducts/MyProducts";
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:categoryName" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/payment" element={<Payment />} />
        <Route path="/checkout/review" element={<OrderReview />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <Footer />
    </>
  );
}
