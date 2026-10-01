import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { sendContactMessage } from "../../services/contactService";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setSent(false);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSent(false);
    setError("");
    try {
      await sendContactMessage(form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (requestError) {
      setError(requestError.message || "Unable to save your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        <div className="contact-card">
          <section className="contact-info">
            <p>GET IN TOUCH</p>
            <h1>Contact Us</h1>
            <p className="contact-subtitle">We'd love to hear from you.</p>

            <div className="contact-details">
              <div className="contact-detail">
                <div className="contact-icon"><Mail size={18} /></div>
                <div><h3>Email</h3><p>support@furniture.com</p></div>
              </div>
              <div className="contact-detail">
                <div className="contact-icon"><Phone size={18} /></div>
                <div><h3>Phone</h3><p>+20 100 000 0000</p></div>
              </div>
              <div className="contact-detail">
                <div className="contact-icon"><MapPin size={18} /></div>
                <div><h3>Location</h3><p>Egypt</p></div>
              </div>
            </div>
          </section>

          <section className="contact-form-wrapper">
            <form className="contact-form" onSubmit={submit}>
              {error && <div className="contact-error">{error}</div>}
              {sent && <div className="contact-success">Your message was saved successfully.</div>}

              <div className="contact-field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" disabled={loading} />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" disabled={loading} />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" required value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="How can we help?" disabled={loading} />
              </div>
              <button type="submit" className="contact-submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
