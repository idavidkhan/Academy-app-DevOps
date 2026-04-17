import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../components/Footer";
import ScrollBtn from "../components/ScrollBtn";
import { Search, HelpCircle, Phone, Mail, ArrowRight } from "lucide-react";
import { BASE_URL } from '../config';

export default function Faqs() {
  const [faqsData, setFaqsData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
    fetchFaqs();
    fetchContactInfo();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/faqs`);
      setFaqsData(res.data);
    } catch (err) {
      console.error("Failed to load FAQs", err);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/contact-info`);
      setContactInfo(res.data);
    } catch (err) {
      console.error("Failed to load contact info", err);
    }
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqsData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10" data-aos="fade-down">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Knowledge <span className="text-teal-600">Base</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Instant clarification for your most pressing inquiries regarding enrollment, technology, and career paths.
          </p>

          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-teal-600 transition-colors" />
            <input
              type="text"
              placeholder="Search for protocols, procedures, or requirements..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-full focus:outline-none focus:border-teal-500/30 focus:bg-white shadow-xl shadow-slate-200/50 transition-all font-medium text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* FAQ Content */}
          <div className="w-full lg:w-2/3 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-20 glass rounded-[3rem] border border-slate-100">
                <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-xl font-bold text-slate-400">No matching inquiries found.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`group glass rounded-[2rem] border border-white transition-all duration-300 ${activeIndex === index ? "shadow-2xl ring-2 ring-teal-500/10" : "shadow-md hover:shadow-xl hover:border-teal-100"
                    }`}
                  data-aos="fade-up"
                >
                  <button
                    className="w-full flex items-center justify-between p-8 text-left"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${activeIndex === index ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-600"}`}>
                        <span className="font-black text-sm">{index + 1}</span>
                      </div>
                      <span className={`text-lg md:text-xl font-black tracking-tight leading-tight transition-colors ${activeIndex === index ? "text-teal-600" : "text-slate-900"}`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeIndex === index ? "bg-teal-600 text-white rotate-180" : "bg-slate-100 text-slate-400"}`}>
                      <svg className="w-4 h-4 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="px-8 pb-10 pl-[4.5rem]">
                      <div className="w-full h-[1px] bg-slate-100 mb-8" />
                      <div className="prose max-w-none text-slate-600 text-lg leading-relaxed news-content">
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 gap-8 flex flex-col">
            <div
              className="bg-teal-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group"
              data-aos="fade-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">Need Support?</h3>
              <p className="text-teal-50/70 text-lg leading-relaxed mb-10 font-medium">
                Our administrative team is available for real-time technical consultation.
              </p>
              <a
                href="/contact"
                className="w-full py-4 bg-teal-600 text-white text-center font-black rounded-2xl hover:bg-white hover:text-teal-900 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xl shadow-black/10"
              >
                Go to Support Center
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>

            <div
              className="glass rounded-[3rem] p-10 shadow-xl border border-white flex flex-col items-center text-center"
              data-aos="fade-left"
              data-delay="100"
            >
              <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-[2rem] flex items-center justify-center mb-8 rotate-3">
                <Phone className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Direct Inquiry</h3>
              <p className="text-slate-500 font-medium mb-8">Speak with our registrar regarding specific enrollment protocols.</p>
              <div className="w-full p-6 bg-slate-900 text-white rounded-[2rem] shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Authenticated Line</p>
                <p className="text-2xl font-black tracking-tighter">
                  {contactInfo?.phone || "000-000-000"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollBtn />
    </div>
  );
}
