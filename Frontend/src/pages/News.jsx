import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNewsContext } from "../context/NewsContext";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollBtn from "../components/ScrollBtn";
import Footer from "../components/Footer";
import DOMPurify from "dompurify";
import { Search, X, ArrowRight, Calendar, Clock, User } from "lucide-react";

function News() {
  const { allNews, loading, error } = useNewsContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    console.log("URL Search parameter detected in News.jsx:", search);
    setSearchQuery(search);
    setLocalSearch(search);
  }, [location.search]);

  useEffect(() => {
    if (allNews) {
      console.log("Filtering news with localSearch:", localSearch, "Total news available:", allNews.length);
      if (localSearch) {
        const searchLower = localSearch.toLowerCase();
        const filtered = allNews.filter((item) => {
          // Cleaned content matching
          const cleanTitle = stripHtml(item.title || "").toLowerCase();
          const cleanContent = stripHtml(item.content || "").toLowerCase();
          const cleanCategory = stripHtml(item.category || "").toLowerCase();

          // Raw content matching (as fallback for special characters)
          const rawTitle = (item.title || "").toLowerCase();
          const rawContent = (item.content || "").toLowerCase();
          const rawCategory = (item.category || "").toLowerCase();

          return cleanTitle.includes(searchLower) ||
            cleanContent.includes(searchLower) ||
            cleanCategory.includes(searchLower) ||
            rawTitle.includes(searchLower) ||
            rawContent.includes(searchLower) ||
            rawCategory.includes(searchLower);
        });
        console.log("Filtered results count:", filtered.length);
        setFilteredNews(filtered);
      } else {
        setFilteredNews(allNews);
      }
    }
  }, [localSearch, allNews]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = localSearch.trim();
    if (query) {
      navigate(`/news?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/news');
    }
  };

  const handleReadMore = (item) => {
    navigate(`/news/${item.id}`);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Karachi",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10" data-aos="fade-down">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            TRESCOL <span className="text-teal-600">Newsroom</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Stay synchronized with the latest breakthroughs in Cybersecurity, Artificial Intelligence, and the evolving digital landscape.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 -mt-12 relative z-20" data-aos="fade-up">
        <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/50">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input
              type="text"
              placeholder="Search field reports or categories..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full px-8 py-6 bg-slate-50/50 rounded-[2rem] border-2 border-transparent focus:border-teal-500/30 outline-none transition-all placeholder:text-slate-300 font-bold text-lg"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    navigate("/news", { replace: true });
                  }}
                  className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <button
                type="submit"
                className="p-4 bg-teal-600 text-white rounded-2xl shadow-lg hover:bg-teal-700 transition-all group-hover:scale-105 active:scale-95"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 pb-40">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold animate-pulse">Synchronizing News Feed...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-32 glass rounded-[3rem] border border-red-100">
            <p className="text-red-500 font-bold text-xl">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {searchQuery && (
              <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100" data-aos="fade-up">
                <p className="text-xl font-bold text-slate-600">
                  Search results for: <span className="text-teal-600">"{searchQuery}"</span>
                  <span className="ml-4 text-sm font-black text-slate-300 uppercase tracking-widest">({filteredNews.length} Intel Found)</span>
                </p>
                <button
                  onClick={() => navigate('/news')}
                  className="px-6 py-3 bg-slate-50 text-slate-900 font-black rounded-xl hover:bg-teal-600 hover:text-white transition-all text-sm border border-slate-100 hover:border-teal-600"
                >
                  Clear Database Query
                </button>
              </div>
            )}
            {filteredNews.length === 0 ? (
              <div className="text-center py-32 glass rounded-[3rem] border border-slate-100" data-aos="fade-up">
                <p className="text-slate-400 font-bold text-xl">No field reports matching your query.</p>
                {searchQuery && (
                  <button
                    onClick={() => navigate('/news')}
                    className="mt-6 px-10 py-4 bg-teal-600 text-white rounded-full font-black shadow-lg hover:bg-teal-700 transition-all"
                  >
                    Return to Full Newsroom
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredNews.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col bg-white rounded-[2.5rem] shadow-premium border border-slate-100 hover:border-teal-200 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                    data-aos="fade-up"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/news/${item.image || "default.jpg"}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest whitespace-nowrap">
                          {formatDateTime(item.created_at).split(',')[0]}
                        </p>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <h3
                        className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-teal-600 transition-colors"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      ></h3>
                      <div
                        className="text-slate-500 text-sm mb-8 line-clamp-3 news-content flex-1"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.content || "No detailed report available.", {
                            ALLOWED_TAGS: ["p", "strong", "em", "span"],
                          }),
                        }}
                      />
                      <button
                        onClick={() => handleReadMore(item)}
                        className="w-full py-4 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-teal-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-slate-100 hover:border-teal-600"
                      >
                        Read Full Analysis
                        <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
      <ScrollBtn />
    </div>
  );
}

export default News;
