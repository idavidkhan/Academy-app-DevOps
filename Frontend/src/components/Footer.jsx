import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast } from "react-toastify";

const Footer = () => {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact-info");
      setContactInfo(res.data);
    } catch (err) {
      console.error("Failed to load contact info", err);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (
      !subscriberEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscriberEmail)
    ) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const trimmedEmail = subscriberEmail.trim().substring(0, 191);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/subscribers",
        { email: trimmedEmail },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message || "Successfully subscribed!");
      setSubscriberEmail("");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warning("This email is already subscribed.");
      } else {
        toast.error(error.response?.data?.message || "Subscription failed.");
      }
    }
  };

  return (
    <div>
      <footer
        className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-6 shadow-lg pt-16 pb-8"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Tagline */}
          <div>
            <h2 className="text-2xl font-bold mb-2">TRESCOL</h2>
            <p className="text-lg">
              Building a tech-savvy future through cybersecurity, AI & digital
              excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-lg">
              <li>
                <NavLink to="/" className="hover:text-white">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-white">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/courses" className="hover:text-white">
                  Courses
                </NavLink>
              </li>
              <li>
                <NavLink to="/news" className="hover:text-white">
                  News
                </NavLink>
              </li>
              <li>
                <NavLink to="/teachers" className="hover:text-white">
                  Teachers
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-white">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Dynamic Contact Info (without social links) */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact</h3>
            {contactInfo ? (
              <ul className="space-y-3 text-lg">
                <li>
                  <i className="fas fa-map-marker-alt mr-2 text-teal-400"></i>
                  {`${contactInfo.address_line1}, ${contactInfo.city}, ${contactInfo.country}`}
                </li>
                <li>
                  <i className="fas fa-envelope mr-2 text-teal-400"></i>
                  {contactInfo.email}
                </li>
                <li>
                  <i className="fas fa-phone-alt mr-2 text-teal-400"></i>
                  {contactInfo.phone}
                </li>
              </ul>
            ) : (
              <p className="text-sm">Loading contact info...</p>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Subscribe</h3>
            <p className="text-lg mb-4">
              Get updates on latest courses & events.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="px-4 py-2 rounded-md bg-white text-black text-sm border border-gray-700 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md transition text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white w-screen mt-12 -ml-6"></div>

        <div className="max-w-7xl mx-auto px-6 text-center text-lg pt-6">
          <p>© {new Date().getFullYear()} TRESCOL. All rights reserved.</p>

          {/* Dynamic Social Links from contactInfo */}
          <div className="flex justify-center gap-5 mt-4 text-teal-400">
            {contactInfo?.facebook && (
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            )}
            {contactInfo?.twitter && (
              <a
                href={contactInfo.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {contactInfo?.linkedin && (
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            )}
            {contactInfo?.github && (
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <i className="fab fa-github"></i>
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;