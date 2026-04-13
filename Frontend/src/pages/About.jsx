import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAboutContext } from "../context/AboutContext";
import { useVideoContext } from "../context/VideoContext"; // Import VideoContext
import ScrollBtn from "../components/ScrollBtn";
import Footer from "../components/Footer";

function About() {
  const { people, loading } = useAboutContext();
  const {
    videoData,
    loading: videoLoading,
    error: videoError,
  } = useVideoContext(); // Use VideoContext
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);

  const handlePlayVideo = () => {
    if (videoData?.videoUrl) {
      setIsVideoModalOpen(true);
    } else {
      console.error("No video URL available");
      alert("Video is not available at the moment.");
    }
  };

  const handleCloseVideo = () => {
    setIsVideoModalOpen(false);
  };

  // Function to convert YouTube Shorts URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // Handle Shorts URLs (e.g., https://www.youtube.com/shorts/DHj4_g3K5GA)
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    // Handle standard YouTube URLs (e.g., https://www.youtube.com/watch?v=DHj4_g3K5GA)
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    // Handle embed URLs or others that are already correct
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
    console.error("Invalid YouTube URL:", url);
    return null;
  };

  function VideoModal({ isOpen, onClose, videoUrl }) {
    const embedUrl = getEmbedUrl(videoUrl);
    if (!isOpen || !embedUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg overflow-hidden w-[90%] max-w-4xl shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl z-10"
          >
            ×
          </button>
          <div
            className="relative w-full"
            style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}
          >
            <iframe
              src={embedUrl}
              title="Video Tour"
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-32 text-teal-600 font-semibold text-xl">
        Loading About Information...
      </div>
    );
  }

  // Split data
  const mission = people.find((p) => p.section === "mission");
  const vision = people.find((p) => p.section === "vision");
  const whyTrescol = people.find((p) => p.section === "why");
  const custom = people.filter((p) => p.section === "custom");
  const founders = people.filter((p) => p.section === "founder");

  return (
    <>
      <section className="bg-slate-50 text-slate-800 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h1
              className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight"
              data-aos="fade-up"
            >
              The Story of <span className="text-teal-600">Trescol</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-delay="100">
              Transforming the global technical landscape through specialized development and strategic mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
            {/* Mission */}
            {mission && (
              <div
                className="glass rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden"
                data-aos="fade-right"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-teal-600 rounded-full"></span>
                  {mission.card_heading}
                </h2>
                <div
                  className="text-lg leading-relaxed text-slate-600 news-content"
                  dangerouslySetInnerHTML={{ __html: mission.card_paragraph }}
                ></div>
              </div>
            )}

            {/* Vision */}
            {vision && (
              <div
                className="glass rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden bg-teal-900 text-white"
                data-aos="fade-left"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-teal-400 rounded-full"></span>
                  {vision.card_heading}
                </h2>
                <div
                  className="text-lg leading-relaxed text-teal-50 opacity-90 news-content"
                  dangerouslySetInnerHTML={{ __html: vision.card_paragraph }}
                ></div>
              </div>
            )}
          </div>

          {/* Why Trescol */}
          {whyTrescol && (
            <div
              className="bg-white rounded-[3rem] p-12 md:p-20 shadow-premium border border-slate-100 mb-32 relative overflow-hidden group"
              data-aos="fade-up"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 text-center tracking-tight">
                {whyTrescol.card_heading}
              </h2>
              <div
                className="text-slate-600 text-xl leading-relaxed max-w-4xl mx-auto text-center news-content"
                dangerouslySetInnerHTML={{ __html: whyTrescol.card_paragraph }}
              ></div>
            </div>
          )}

          {/* Additional Sections */}
          {custom.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
              {custom.map((item, index) => (
                <div
                  key={index}
                  className="glass rounded-[2.5rem] p-10 shadow-xl border border-white"
                  data-aos="fade-up"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-teal-600 rounded-full"></span>
                    {item.card_heading}
                  </h2>
                  <div
                    className="text-slate-600 text-lg leading-relaxed news-content"
                    dangerouslySetInnerHTML={{
                      __html: item.card_paragraph,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {/* Founders */}
          {founders.length > 0 && (
            <div className="pt-20">
              <div className="text-center mb-20">
                <h2
                  className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight"
                  data-aos="zoom-in"
                >
                  Architects of <span className="text-teal-600">Innovation</span>
                </h2>
                <p className="text-xl text-slate-500 mt-4">The visionary leadership behind TRESCOL's global mission.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {founders.map((person, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-100 hover:border-teal-200 hover:-translate-y-2 transition-all duration-500"
                    data-aos="fade-up"
                  >
                    <div className="relative mb-10 pt-4">
                      <div className="absolute -inset-2 bg-teal-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img
                        src={`http://localhost:5000${person.image}`}
                        alt={person.trainer_name}
                        className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-slate-50 shadow-2xl relative z-10"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {person.trainer_name}
                      </h3>
                      <p className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-6">{person.title}</p>

                      <div className="relative mb-8">
                        <i className="fas fa-quote-left absolute -top-4 -left-2 text-teal-100 text-4xl"></i>
                        <p className="italic text-slate-600 text-sm relative z-10 leading-relaxed px-4">
                          {person.quote}
                        </p>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-50 pt-6">{person.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section
        className="py-32 bg-white overflow-hidden"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8 order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-sm font-bold uppercase tracking-widest border border-teal-100">
                Heritage & Culture
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Our Environment <br /> of <span className="text-teal-600">Excellence</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Step inside our technical ecosystem and see where the magic happens. Our facilities are designed to foster creativity, collaboration, and intense technical growth.
              </p>
              {!videoLoading && videoData && (
                <button
                  onClick={handlePlayVideo}
                  className="btn-primary flex items-center gap-3 shadow-2xl shadow-teal-600/20"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  Launch Virtual Experience
                </button>
              )}
            </div>

            <div className="lg:w-1/2 relative group order-1 lg:order-2">
              {videoLoading && (
                <div className="w-full aspect-video bg-slate-100 animate-pulse rounded-[3rem]"></div>
              )}
              {videoData && (
                <div className="relative">
                  <div className="absolute -inset-4 bg-teal-600/5 rounded-[3.5rem] blur-2xl group-hover:bg-teal-600/10 transition-colors"></div>
                  <div className="relative overflow-hidden rounded-[3rem] shadow-2xl">
                    <img
                      src={`http://localhost:5000/${videoData.thumbnail}`}
                      alt="Video Tour Thumbnail"
                      className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                    <button
                      onClick={handlePlayVideo}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 glass rounded-full flex items-center justify-center text-teal-600 transform group-hover:scale-125 transition-all duration-500 shadow-2xl hover:bg-teal-600 hover:text-white"
                    >
                      <svg
                        className="w-10 h-10 ml-1 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <VideoModal
                isOpen={isVideoModalOpen}
                onClose={handleCloseVideo}
                videoUrl={videoData?.videoUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollBtn />
    </>
  );
}

export default About;