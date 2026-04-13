import { Calendar, User, Tag, Share2, Search, ArrowRight, MessageSquare, Clock, ArrowLeft, Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from "lucide-react";
import { useNewsContext } from "../context/NewsContext";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollBtn from "../components/ScrollBtn";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allNews, popularNews, loading, error, subscribe, categories } = useNewsContext();

  const [news, setNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (allNews && allNews.length > 0) {
      const foundNews = allNews.find((item) => item.id === parseInt(id));
      setNews(foundNews);
    }
  }, [id, allNews]);

  const onExecuteSearch = (manualQuery) => {
    const query = typeof manualQuery === 'string' ? manualQuery : searchTerm.trim();
    console.log("Failsafe Search Initiated:", query);
    if (query) {
      toast.info(`SITREP: Initializing database redirect for "${query}"...`);
      // Using direct window.location.assign to ensure a fresh page load with search parameters
      // This bypasses any potential SPA routing or history push state issues.
      const targetUrl = `${window.location.origin}/news?search=${encodeURIComponent(query)}`;
      console.log("Redirecting to:", targetUrl);
      window.location.assign(targetUrl);
    } else {
      toast.warn("Please enter a search term for database retrieval.");
    }
  };

  useEffect(() => {
    window.onExecuteSearch = onExecuteSearch;
    return () => delete window.onExecuteSearch;
  }, [searchTerm]);


  const handleShare = (platform) => {
    const url = window.location.href;
    const title = news?.title || "Check out this article from TRESCOL";

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.info("Transmission URL copied to clipboard!");
        break;
      default:
        break;
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribe(email);
      toast.success("Subscribed successfully! Digital link established.");
      setEmail("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to establish subscription sync.";
      toast.error(errorMsg);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center glass p-20 rounded-[3rem] border border-white shadow-2xl">
        <p className="text-red-500 font-bold text-xl mb-6">Internal Retrieval Error: {error}</p>
        <button onClick={() => navigate("/news")} className="btn-primary px-8 py-4 flex items-center gap-2 mx-auto">
          <ArrowLeft className="w-5 h-5" /> Back to Newsroom
        </button>
      </div>
    </div>
  );

  if (!news) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center glass p-20 rounded-[3rem] border border-white shadow-2xl">
        <p className="text-slate-400 font-bold text-xl mb-6">Article not found in database.</p>
        <button onClick={() => navigate("/news")} className="btn-primary px-8 py-4 flex items-center gap-2 mx-auto">
          <ArrowLeft className="w-5 h-5" /> Newsroom Return
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm mb-6 inline-block">
                {news.category || "General Reporting"} • {new Date(news.created_at).toLocaleDateString()}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: news.title }}></h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-slate-400 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  {news.author || "Trescol Editorial"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  5 min read
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 pb-40">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <div className="relative rounded-[3rem] overflow-hidden shadow-premium group">
              <img
                src={`http://localhost:5000/uploads/news/${news.image || "default.jpg"}`}
                alt={news.title}
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>

            <div className="glass rounded-[3rem] p-12 border border-white shadow-xl">
              <div
                className="text-slate-600 prose prose-lg prose-teal max-w-none leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-teal-600 first-letter:float-left first-letter:mr-3"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }}
              />

              <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Share Transmission:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {news.tags?.split(',').map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">#{tag.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-10">
            {/* Search */}
            <div className="glass rounded-[3rem] p-10 border border-teal-100 shadow-xl relative">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Database Query</h3>
              <div className="relative flex items-center bg-slate-50 rounded-2xl border-2 border-slate-100 focus-within:border-teal-500 transition-all p-1">
                <input
                  type="text"
                  placeholder="Article ID or phrase..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onExecuteSearch();
                    }
                  }}
                  className="w-full pl-4 pr-12 py-3 bg-transparent text-slate-900 outline-none placeholder:text-slate-300 font-bold"
                />
                <button
                  type="button"
                  onClick={() => onExecuteSearch()}
                  className="absolute right-1 p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all cursor-pointer shadow-sm"
                  aria-label="Execute Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Popular News */}
            <div className="glass rounded-[3rem] p-10 border border-white shadow-xl">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Related Intel</h3>
              <div className="space-y-8">
                {popularNews && popularNews.slice(0, 4).map((item) => (
                  <div key={item.id} className="group cursor-pointer flex gap-4" onClick={() => navigate(`/news/${item.id}`)}>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={`http://localhost:5000/uploads/news/${item.image || "default.jpg"}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors" dangerouslySetInnerHTML={{ __html: item.title }}></h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe */}
            <div className="glass-teal text-white rounded-[3rem] p-10 shadow-xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6" />
                SITREP Updates
              </h3>
              <p className="text-teal-50/70 font-bold mb-8 text-sm leading-relaxed">
                Receive high-priority technical briefings directly to your terminal.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <input
                  type="email"
                  placeholder="Identity email@..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 rounded-2xl border-2 border-white/20 focus:border-white outline-none transition-all placeholder:text-teal-100/30 font-bold text-white"
                />
                <button type="submit" className="w-full py-4 bg-white text-teal-600 rounded-2xl font-black shadow-lg shadow-teal-900/20 hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 group/btn">
                  Initialize Sync
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollBtn />
    </div>
  );
}

export default NewsDetail;
