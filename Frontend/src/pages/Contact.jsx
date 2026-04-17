import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import ScrollBtn from "../components/ScrollBtn";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { BASE_URL } from '../config';

function Contact() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);

    axios
      .get(`${BASE_URL}/api/contact-info`)
      .then((res) => {
        setContact(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch contact info:", err);
        setLoading(false);
      });
  }, []);

  const generateMapSrc = (location) => {
    if (!location) return "https://www.google.com/maps?q=Islamabad&output=embed";
    if (location.startsWith("https://www.google.com/maps/embed")) return location;
    return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  };

  const mapSrc = generateMapSrc(contact?.map_location);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10,15}$/, "Phone number must be 10–15 digits")
      .required("Phone number is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    axios
      .post(`${BASE_URL}/api/contact-form`, values)
      .then(() => {
        toast.success("Message sent successfully!");
        resetForm();
      })
      .catch(() => {
        toast.error("Failed to send message. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10" data-aos="fade-down">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Let’s <span className="text-teal-600">Connect</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Have questions about our programs or need technical guidance? Our experts are here to help you navigate your journey.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Info Blocks */}
          <div className="glass rounded-[2rem] p-8 shadow-xl border border-white flex gap-6 group hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest text-xs">Direct Line</h3>
              {contact?.phone ? (
                <a href={`tel:${contact.phone}`} className="text-xl font-bold text-slate-700 hover:text-teal-600 transition-colors uppercase tracking-tighter">
                  {contact.phone}
                </a>
              ) : (
                <p className="text-slate-400">Loading support line...</p>
              )}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl border border-white flex gap-6 group hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-delay="100">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest text-xs">Email Correspondence</h3>
              {contact?.email ? (
                <div className="space-y-1">
                  <a href={`mailto:${contact.email}`} className="block text-slate-700 font-bold hover:text-teal-600 transition-colors">
                    {contact.email}
                  </a>
                  <a href={`mailto:${contact.support_email}`} className="block text-sm text-slate-400 hover:text-teal-600 transition-colors capitalize">
                    Admissions: {contact.support_email}
                  </a>
                </div>
              ) : (
                <p className="text-slate-400">Loading digital channels...</p>
              )}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl border border-white flex gap-6 group hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-delay="200">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest text-xs">Operations</h3>
              {contact ? (
                <div className="space-y-1">
                  <p className="text-slate-700 font-bold capitalize">{contact.working_days}</p>
                  <p className="text-sm text-slate-400 capitalize">{contact.weekend}</p>
                </div>
              ) : (
                <p className="text-slate-400">Loading schedule...</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="glass rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white relative overflow-hidden" data-aos="fade-right">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Send a Dispatch</h2>

            <Formik
              initialValues={{ name: "", email: "", phone: "", subject: "", message: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <Field name="name" className="input" placeholder="Enter your name" />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <Field name="email" type="email" className="input" placeholder="email@example.com" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Protocol</label>
                    <Field name="phone" className="input" placeholder="+92 XXX XXXXXXX" />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Inquiry Subject</label>
                    <Field name="subject" className="input" placeholder="Nature of inquiry" />
                    <ErrorMessage name="subject" component="div" className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Detailed Message</label>
                  <Field name="message" as="textarea" rows="4" className="input py-4 min-h-[120px]" placeholder="Type your message here..." />
                  <ErrorMessage name="message" component="div" className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1" />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg shadow-xl shadow-teal-600/20 flex items-center justify-center gap-3 mt-4"
                >
                  Broadcast Message
                  <Send className="w-5 h-5" />
                </button>
              </Form>
            </Formik>
          </div>

          {/* Map & Office */}
          <div className="space-y-8" data-aos="fade-left">
            <div className="glass rounded-[3rem] p-10 shadow-xl border border-white">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <MapPin className="text-teal-600 w-6 h-6" />
                Global Headquarter
              </h3>
              {contact ? (
                <div className="space-y-2 text-slate-600 leading-relaxed font-medium">
                  <p className="text-lg font-bold text-slate-900">{contact.office_name}</p>
                  <p>{contact.address_line1}</p>
                  <p>{contact.address_line2}</p>
                  <p className="text-teal-600 font-bold uppercase tracking-widest text-sm">{contact.city}, {contact.country}</p>
                </div>
              ) : (
                <p className="text-slate-400">Loading coordinate details...</p>
              )}
            </div>

            <div className="w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white">
              {loading ? (
                <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
                  <p className="text-slate-400 font-bold">Initializing Satellite Link...</p>
                </div>
              ) : contact?.map_location ? (
                <iframe
                  title="TRESCOL Location"
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center p-12 text-center">
                  <p className="text-slate-400 font-medium">Geospatial link not established. Configure in console.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/923300111172"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-black text-white p-5 rounded-full shadow-2xl z-50 hover:bg-teal-600 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
        data-aos="zoom-in"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48A11.77 11.77 0 0012.06 0a11.76 11.76 0 00-10 18.06L0 24l6.11-2.01A11.76 11.76 0 0012 24c6.61 0 12-5.39 12-12a11.78 11.78 0 00-3.48-8.52zM12 22.11a10.07 10.07 0 01-5.19-1.45l-.37-.22-3.63 1.19 1.19-3.63-.22-.37A10.07 10.07 0 1122.11 12 10.11 10.11 0 0112 22.11zM17 16.2c-.29.81-1.7 1.51-2.38 1.58s-1.36.23-4-1.25a11.41 11.41 0 01-2.88-2.88c-1.48-2.64-1.44-3.45-1.25-4s.77-2.09 1.58-2.38.9-.16 1.22 0 .79 1 .88 1.28a1.14 1.14 0 01-.06 1.08c-.1.15-.15.26-.29.41s-.3.31-.46.48c-.15.17-.31.35-.12.69s1.1 1.82 2.36 2.47c.46.23.81.37 1.09.48a2.11 2.11 0 00.9.11 1.36 1.36 0 00.85-.57c.15-.2.33-.51.51-.81s.34-.51.54-.54.42 0 .6.08 1.56.73 1.83.86.45.21.52.33.07.84-.21 1.65z" />
        </svg>
      </a>

      <Footer />
      <ScrollBtn />
      <ToastContainer />
    </div>
  );
}

export default Contact;