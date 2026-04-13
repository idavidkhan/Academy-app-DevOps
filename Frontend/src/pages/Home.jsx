import React, { useEffect, useState } from "react";
import { useCourseContext } from "../context/CourseContext";
import { useNewsContext } from "../context/NewsContext";
import { useTeacherContext } from "../context/TeacherContext";
import { useVideoContext } from "../context/VideoContext";
import { useScheduleContext } from "../context/ScheduleContext";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollBtn from "../components/ScrollBtn";
import Footer from "../components/Footer";
import Background from "../assets/background.png";
import Hero from "../components/Hero";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

function Home() {
  const { schedules, loading: scheduleLoading } = useScheduleContext();
  const navigate = useNavigate();
  const {
    allNews,
    setSelectedNews,
    loading: newsLoading,
    error: newsError,
  } = useNewsContext();

  function formatDateTime(dateString) {
    if (!dateString) return "Date not available";
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
  }

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());

  function getCardsPerPage() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  useEffect(() => {
    const handleResize = () => {
      setCardsPerPage(getCardsPerPage());
      setCurrentStartIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For Courses
  const { courses } = useCourseContext();
  const maxIndex = Math.max(0, (courses?.length || 0) - cardsPerPage);
  const [todayDate, setTodayDate] = useState(() => {
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTodayDate(
        new Date(now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }))
      );
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Improved schedule filtering with timezone awareness
  const validSchedules =
    schedules?.filter((sch) => {
      const endDate = new Date(
        new Date(sch.end_date).toLocaleString("en-US", {
          timeZone: "Asia/Karachi",
        })
      );
      return new Date(endDate) >= todayDate;
    }) || [];

  // Filter courses: only include courses that
  // - have a valid schedule (future or ongoing), OR
  // - are not scheduled at all
  const sortedCourses = [...(courses || [])]
    .filter((course) => {
      const isScheduled = schedules?.some((sch) => sch.course_id === course.id);
      const isValid = validSchedules.some((sch) => sch.course_id === course.id);
      return isValid || !isScheduled;
    })
    .sort((a, b) => {
      const aScheduled = validSchedules.some((sch) => sch.course_id === a.id);
      const bScheduled = validSchedules.some((sch) => sch.course_id === b.id);
      return bScheduled - aScheduled; // Scheduled first
    });

  // Paginate if you're doing carousel/slider
  const visibleCourses = sortedCourses.slice(
    currentStartIndex,
    currentStartIndex + cardsPerPage
  );

  // For Teachers
  const { teachers } = useTeacherContext();
  const [currentTeacherStartIndex, setCurrentTeacherStartIndex] = useState(0);
  const [teachersPerPage, setTeachersPerPage] = useState(getCardsPerPage());
  const maxTeacherIndex = Math.max(
    0,
    (teachers?.length || 0) - teachersPerPage
  );

  useEffect(() => {
    const handleResize = () => {
      const perPage = getCardsPerPage();
      setCardsPerPage(perPage);
      setTeachersPerPage(perPage);
      setCurrentStartIndex(0);
      setCurrentTeacherStartIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For News
  const [currentNewsStartIndex, setCurrentNewsStartIndex] = useState(0);
  const [newsPerPage, setNewsPerPage] = useState(getCardsPerPage());
  const maxNewsIndex = Math.max(0, (allNews?.length || 0) - newsPerPage);

  useEffect(() => {
    const handleResize = () => {
      const perPage = getCardsPerPage();
      setNewsPerPage(perPage);
      setCurrentNewsStartIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [allNews]);

  const handleNewsArrowClick = (direction) => {
    if (direction === "left") {
      setCurrentNewsStartIndex((prev) => Math.max(prev - 1, 0));
    } else {
      setCurrentNewsStartIndex((prev) => Math.min(prev + 1, maxNewsIndex));
    }
  };

  const visibleNews =
    allNews?.slice(
      currentNewsStartIndex,
      currentNewsStartIndex + newsPerPage
    ) || [];

  const handleTeacherPrev = () => {
    setCurrentTeacherStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleTeacherNext = () => {
    setCurrentTeacherStartIndex((prev) => Math.min(prev + 1, maxTeacherIndex));
  };

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setCurrentStartIndex((prev) => Math.max(prev - 1, 0));
    } else {
      setCurrentStartIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const handleCourseClick = (course) => {
    navigate(`/course-detail/${course.id}`, { state: { course } });
  };

  const handleReadMore = (item) => {
    navigate(`/news/${item.id}`);
  };

  const handleKnowMore = (teacher) => {
    navigate(`/teacher-detail/${teacher.id}`, { state: { teacher } });
  };

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const {
    videoData,
    loading: videoLoading,
    error: videoError,
  } = useVideoContext();

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
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
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
        <div className="bg-white rounded-lg overflow-hidden relative w-[90%] max-w-4xl shadow-lg">
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


  // For upcoming Section
  const openCourses = (courses || []).filter((course) => {
    return validSchedules.some((sch) => sch.course_id === course.id);
  }).length;

  const unscheduledCourses = (courses || []).filter((course) => {
    return !schedules?.some((sch) => sch.course_id === course.id);
  }).length;

  const totalCourses = courses?.length || 0;
  const totalTrainers = teachers?.length || 0;

  const dynamicStatsData = [
    {
      icon: "fa-book-open",
      count: openCourses,
      label: "Schedule Courses",
      sub: "Apply Online",
      url: "/register",
    },
    {
      icon: "fa-chalkboard-teacher",
      count: totalTrainers,
      label: "Registered Trainers",
      sub: "View Trainers List",
      url: "/teachers",
    },
    {
      icon: "fa-clock",
      count: unscheduledCourses,
      label: "Unschedule Courses",
      sub: "Schedule To Be Decided",
      url: "/courses?filter=unscheduled",
    },
    {
      icon: "fa-graduation-cap",
      count: totalCourses,
      label: "Total Offered Courses",
      sub: "View Courses List",
      url: "/courses",
    },
  ];

  return (
    <>
      <Hero />
      <section
        id="featured-courses"
        className="py-24 bg-white/50 backdrop-blur-sm px-4 sm:px-6 lg:px-8 border-y border-slate-200/50"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Explore Our <span className="text-teal-600">Featured Courses</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Master new skills with our scientifically designed curriculum. Browse through our top-rated professional courses.
            </p>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => handleArrowClick("left")}
              className="absolute left-0 z-10 glass text-teal-600 p-4 rounded-full hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-premium"
              style={{ transform: "translateX(-50%)" }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-12"
              data-aos="fade-up"
            >
              {visibleCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-3xl shadow-premium overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-slate-100"
                >
                  <div className="overflow-hidden">
                    <img
                      src={`http://localhost:5000/${course.image || "Uploads/courses/default.jpg"
                        }`}
                      alt={course.title || "Course Image"}
                      className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                      onError={(e) =>
                        console.error(
                          `Course image failed to load: ${course.image}`
                        )
                      }
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {course.title || "Untitled"}
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={`http://localhost:5000/uploads/${course.trainer_image || "teachers/default.jpg"
                          }`}
                        alt={course.trainer_name || "Trainer"}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          console.error(
                            `Trainer image failed to load: ${course.trainer_image}`
                          );
                        }}
                      />
                      <span className="text-sm text-gray-600">
                        by {course.trainer_name || "Unknown"}
                      </span>
                    </div>

                    <div
                      className="text-sm text-gray-700 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: course.description || "",
                      }}
                    ></div>
                    {(() => {
                      const courseSchedule = schedules.find(
                        (sch) => sch.course_id === course.id
                      );

                      return (
                        <ul className="text-sm text-gray-500 mb-4 space-y-1">
                          <li>
                            <strong>Start Date:</strong>{" "}
                            {formatDateTime(courseSchedule?.start_date)}
                          </li>
                          <li>
                            <strong>End Date:</strong>{" "}
                            {formatDateTime(courseSchedule?.end_date)}
                          </li>
                          <li>
                            <strong>Timing:</strong>{" "}
                            {courseSchedule?.timing || "N/A"}
                          </li>
                          <li>
                            <strong>Venue:</strong>{" "}
                            {courseSchedule?.venue || "N/A"}
                          </li>
                          <li>
                            <strong>Duration:</strong>{" "}
                            {course.duration || "N/A"}
                          </li>
                          <li>
                            <strong>Fees:</strong> {course.fees || "N/A"}
                          </li>
                        </ul>
                      );
                    })()}

                    <button
                      onClick={() => handleCourseClick(course)}
                      className="w-full btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleArrowClick("right")}
              className="absolute right-0 z-10 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition"
              style={{ transform: "translateX(50%)" }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => navigate("/courses")}
              className="px-10 py-4 bg-teal-50 text-teal-700 border-2 border-teal-100 rounded-full font-bold hover:bg-teal-100 transition-all duration-300 transform hover:scale-105"
            >
              View All Professional Courses
            </button>
          </div>
        </div>
      </section>
      <section
        className="py-24 bg-teal-50/50"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              News & <span className="text-teal-600">Updates</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stay ahead with the latest trends and stories from our learning community.
            </p>
          </div>

          {newsLoading && (
            <p className="text-center text-gray-600">Loading news...</p>
          )}
          {newsError && <p className="text-center text-red-600">{newsError}</p>}

          {!newsLoading && !newsError && visibleNews.length === 0 && (
            <p className="text-center text-gray-600">No news available.</p>
          )}

          {!newsLoading && !newsError && visibleNews.length > 0 && (
            <div
              className="relative flex items-center mt-20"
              data-aos="fade-up"
            >
              <button
                onClick={() => handleNewsArrowClick("left")}
                className="absolute left-0 z-10 glass text-teal-600 p-4 rounded-full hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-premium"
                style={{ transform: "translateX(-50%)" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-12">
                {visibleNews.map((item) => {
                  const sanitizedHtml = DOMPurify.sanitize(item.content || "", {
                    USE_PROFILES: { html: true },
                    ALLOWED_TAGS: [
                      "p",
                      "strong",
                      "em",
                      "ul",
                      "ol",
                      "li",
                      "a",
                      "span",
                      "div",
                      "br",
                    ],
                    ALLOWED_ATTR: ["style", "href", "target"],
                  });

                  return (
                    <div
                      key={item.id}
                      className="group relative flex w-full flex-col rounded-3xl bg-white text-slate-700 shadow-premium transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-slate-100"
                    >
                      <div className="relative mx-4 -mt-6 h-48 overflow-hidden rounded-[2rem] bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg shadow-teal-500/40">
                        <img
                          src={`http://localhost:5000/uploads/news/${item.image || "default.jpg"}`}
                          alt={item.title || "News Image"}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          onError={(e) =>
                            console.error(`Image failed to load: ${item.image}`)
                          }
                        />
                      </div>
                      <div className="p-8">
                        <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-4">
                          📅 {formatDateTime(item.created_at)}
                        </p>
                        <h5 className="mb-4 text-xl font-bold text-slate-900 leading-tight group-hover:text-teal-600 transition-colors">
                          {item.title || "Untitled"}
                        </h5>
                        <div
                          className="text-sm text-slate-600 line-clamp-4 news-content leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: sanitizedHtml || "No content available",
                          }}
                        />
                      </div>
                      <div className="p-8 pt-0">
                        <button
                          type="button"
                          onClick={() => handleReadMore(item)}
                          className="text-sm font-black text-teal-600 hover:text-teal-800 flex items-center gap-2 group/btn"
                        >
                          Read Full Story
                          <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleNewsArrowClick("right")}
                className="absolute right-0 z-10 glass text-teal-600 p-4 rounded-full hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-premium"
                style={{ transform: "translateX(50%)" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="mt-20 text-center">
            <button
              onClick={() => navigate("/news")}
              className="px-10 py-4 bg-teal-50 text-teal-700 border-2 border-teal-100 rounded-full font-bold hover:bg-teal-100 transition-all duration-300 transform hover:scale-105"
            >
              Explore TRESCOL Newsroom
            </button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section
        className="py-32 bg-white"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-sm font-bold uppercase tracking-widest border border-teal-100">
                Immersive Experience
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Take a Digital Tour <br /> of <span className="text-teal-600">Trescol</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Experience the heart of TRESCOL through our virtual campus tour. Witness our world-class facilities and the vibrant community waiting for you.
              </p>
              <button
                onClick={handlePlayVideo}
                className="btn-primary flex items-center gap-3 shadow-2xl shadow-teal-600/20"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                Play Virtual Tour
              </button>
            </div>

            <div className="lg:w-1/2 relative group">
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

      {/* Teacher Section */}
      <section
        className="py-32 bg-slate-900 text-white overflow-hidden relative"
        data-aos="fade-up"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Meet the <span className="text-teal-400">Mentors</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Learn from industry leaders who are passionate about shaping the future of global tech development.
            </p>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={handleTeacherPrev}
              className="absolute left-0 z-20 glass-dark text-teal-400 p-5 rounded-full hover:bg-teal-400 hover:text-black transition-all duration-300 transform -translate-x-1/2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8"
              data-aos="fade-up"
            >
              {teachers
                ?.slice(
                  currentTeacherStartIndex,
                  currentTeacherStartIndex + teachersPerPage
                )
                .map((teacher) => (
                  <div
                    key={teacher.id}
                    className="group bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative mb-8 pt-4">
                      <div className="absolute -inset-2 bg-teal-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img
                        src={`http://localhost:5000/uploads/${teacher.image || "default.jpg"}`}
                        alt={teacher.name || "Teacher"}
                        className="w-48 h-48 mx-auto object-cover rounded-full shadow-2xl relative z-10 border-4 border-white/10"
                      />
                    </div>

                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {teacher.name || "Unknown"}
                      </h3>
                      <p className="text-teal-400 font-bold text-sm uppercase tracking-widest">
                        {teacher.designation || "Senior Technical Mentor"}
                      </p>
                      <div
                        className="text-slate-400 text-sm line-clamp-2 italic leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: teacher.bio || "<p>No bio available</p>",
                        }}
                      ></div>

                      <div className="flex justify-center gap-5 pt-6 text-slate-400">
                        {teacher.linkedin && (
                          <a href={teacher.linkedin} className="hover:text-teal-400 transition-colors">
                            <i className="fab fa-linkedin text-xl"></i>
                          </a>
                        )}
                        {teacher.github && (
                          <a href={teacher.github} className="hover:text-white transition-colors">
                            <i className="fab fa-github text-xl"></i>
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => handleKnowMore(teacher)}
                        className="mt-6 w-full py-3 bg-white/10 text-white rounded-full font-bold hover:bg-teal-500 hover:text-black transition-all duration-300 border border-white/10 hover:border-teal-500"
                      >
                        Research Profile
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={handleTeacherNext}
              className="absolute right-0 z-20 glass-dark text-teal-400 p-5 rounded-full hover:bg-teal-400 hover:text-black transition-all duration-300 transform translate-x-1/2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming & Completed Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-bold uppercase tracking-widest border border-teal-200 mb-6">
              TRESCOL Impact
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Our Journey in <span className="text-teal-600">Numbers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dynamicStatsData.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-[2.5rem] p-10 shadow-premium border border-slate-100 hover:border-teal-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter">
                  {item.count}
                </h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-6">{item.label}</p>
                <button
                  onClick={() => navigate(item.url)}
                  className="text-teal-600 font-black text-sm hover:text-teal-800 flex items-center justify-center gap-2 mx-auto group-hover:gap-3 transition-all"
                >
                  {item.sub}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <ScrollBtn />
    </>
  );
}

export default Home;