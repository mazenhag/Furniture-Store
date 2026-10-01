import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <h2>Furniture</h2>

          <p>
            Create a home you love with furniture
            designed for comfort, style, and everyday living.
          </p>

          <div className="footer-socials">

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
            >
              <span className="social-letter facebook-letter">
                f
              </span>
            </a>


            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
            >
              <span className="social-letter instagram-letter">
                ◎
              </span>
            </a>


            {/* Twitter / X */}
            <a
              href="#"
              aria-label="Twitter"
            >
              <span className="social-letter twitter-letter">
                𝕏
              </span>
            </a>

          </div>

        </div>


        {/* Quick Links */}
        <div className="footer-column">

          <h3>Quick Links</h3>

          <ul>

            <li>
              <a href="/">
                Home
              </a>
            </li>

            <li>
              <a href="/shop">
                Shop
              </a>
            </li>

            <li>
              <a href="/categories">
                Categories
              </a>
            </li>

            <li>
              <a href="/wishlist">
                Wishlist
              </a>
            </li>

          </ul>

        </div>


        {/* Customer Service */}
        <div className="footer-column">

          <h3>Customer Service</h3>

          <ul>

            <li>
              <a href="/contact">
                Contact Us
              </a>
            </li>

            <li>
              <a href="#">
                FAQ
              </a>
            </li>

            <li>
              <a href="#">
                Shipping & Delivery
              </a>
            </li>

            <li>
              <a href="#">
                Returns & Refunds
              </a>
            </li>

          </ul>

        </div>


        {/* Contact */}
        <div className="footer-column footer-contact">

          <h3>Contact Us</h3>

          <div className="footer-contact-item">

            <MapPin size={17} />

            <span>
              Cairo, Egypt
            </span>

          </div>


          <div className="footer-contact-item">

            <Phone size={17} />

            <span>
              +20 100 000 0000
            </span>

          </div>


          <div className="footer-contact-item">

            <Mail size={17} />

            <span>
              support@furniture.com
            </span>

          </div>

        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
           Eng/Mazen Hagag © 2026 Furniture. All rights reserved.
          </p>

          <div className="footer-legal">

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Terms & Conditions
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;