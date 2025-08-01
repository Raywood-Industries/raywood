import React, { useState, useRef, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = forwardRef((props, ref) => {
  const [inquiry, setInquiry] = useState({ name: "", email: "", message: "" });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  // Use environment-based API URL (fallback to localhost in dev)
  const API_BASE = process.env.REACT_APP_API_BASE || "https://raywoodind.onrender.com";

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiry((prev) => ({
      ...prev,
      [name]: name === "message" ? value.slice(0, 500) : value,
    }));

    if (name === "message" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      });
      const data = await response.json();
      console.log("Inquiry response:", data);

      if (response.ok) {
        alert("Inquiry submitted! Please check your email for confirmation.");
        setInquiry({ name: "", email: "", message: "" });
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } else {
        alert(data.error || "Failed to submit inquiry.");
      }
    } catch (error) {
      console.error("Inquiry submission error:", error);
      alert("Failed to submit inquiry.");
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await response.json();
      if (data.message === "Already subscribed") {
        navigate("/already_unsubscribed");
        setNewsletterEmail("");
      } else if (response.ok) {
        alert("Subscribed to newsletter!");
        setNewsletterEmail("");
      } else {
        alert(data.message || "Failed to subscribe.");
      }
    } catch (error) {
      alert("Failed to subscribe.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer ref={ref} className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Inquiry Form */}
          <form onSubmit={handleInquirySubmit} className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold mb-2">Send an Inquiry</h3>
            <input
              type="text"
              name="name"
              value={inquiry.name}
              onChange={handleInquiryChange}
              placeholder="Name"
              required
              className="w-full px-4 py-2 rounded text-gray-800"
            />
            <input
              type="email"
              name="email"
              value={inquiry.email}
              onChange={handleInquiryChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 rounded text-gray-800"
            />
            <div className="relative">
              <textarea
                ref={textareaRef}
                name="message"
                value={inquiry.message}
                onChange={handleInquiryChange}
                placeholder="Message"
                required
                maxLength={500}
                className="w-full px-4 py-2 rounded text-gray-800 pr-16 resize-none overflow-hidden min-h-[8rem]"
                style={{ minHeight: "8rem" }}
              />
              <span className="absolute bottom-2 right-4 text-xs text-gray-500 pointer-events-none select-none">
                {inquiry.message.length}/500
              </span>
            </div>
            <button
              type="submit"
              className={`bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold ${
                inquiryLoading
                  ? "bg-red-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={inquiryLoading}
            >
              {inquiryLoading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {/* Business Info */}
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold">Raywood Industries</h3>
            <p>
              Email:{" "}
              <a
                href="mailto:kwhite@raywoodind.com"
                className="text-white hover:underline"
              >
                info@raywoodind.com
              </a>
            </p>
            <p>Phone: (313) 729-9300</p>
            <p>440 Burroughs St. Suite 612,</p>
            <p>Detroit, MI 48202</p>
          </div>
        </div>

        {/* Newsletter Form */}
        <form onSubmit={handleNewsletterSubmit} className="mt-10 text-center">
          <h4 className="text-xl font-semibold mb-2">Subscribe to our Newsletter</h4>
          <div className="flex justify-center gap-4 flex-wrap">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="px-4 py-2 rounded text-gray-800 w-72"
            />
            <button
              type="submit"
              className={`bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold ${
                newsletterLoading
                  ? "bg-red-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={newsletterLoading}
            >
              {newsletterLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>

        {/* Unsubscribe Link */}
        <div className="text-center mt-4">
          <Link to="/Unsubscribe" className="text-sm text-gray-500">
            Unsubscribe from our newsletter
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 py-4">
          &copy; {new Date().getFullYear()} Raywood Industries, LLC
        </p>
      </div>
    </footer>
  );
});

export default Footer;