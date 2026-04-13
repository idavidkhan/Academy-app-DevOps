import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useScheduleContext } from "../context/ScheduleContext";
import { useTeacherContext } from "../context/TeacherContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import ScrollBtn from "../components/ScrollBtn";
import DOMPurify from "dompurify";
import { Calendar, Clock, MapPin, DollarSign, User, ChevronRight, BookOpen, CheckCircle, ArrowRight } from "lucide-react";

function CourseDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  const { schedules } = useScheduleContext();
  const { teachers } = useTeacherContext();

  const schedule = schedules.find((s) => s.course_id === course?.id);

  const [teacherId, setTeacherId] = useState(null);
  useEffect(() => {
    if (course?.trainer_name && teachers) {
      const teacher = teachers.find((t) => t.name === course.trainer_name);
      if (teacher) setTeacherId(teacher.id);
    }
  }, [course?.trainer_name, teachers]);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000, once: true });
  }, []);

  function formatDateTime(dateString) {
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

  const handleTeacherClick = () => {
    if (teacherId) {
      navigate(`/teacher-detail/${teacherId}`, {
        state: { teacher: teachers.find((t) => t.id === teacherId) },
      });
    }
  };

  const handleEnrollClick = () => {
    if (!schedule) {
      toast.error("Enrollment for this course is currently closed.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    navigate("/register", { state: { course } });
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center glass p-20 rounded-[3rem] border border-white shadow-2xl">
          <p className="text-slate-400 font-bold text-xl mb-6">Course intelligence not found.</p>
          <button
            onClick={() => navigate("/courses")}
            className="btn-primary px-8 py-4 flex items-center gap-2 mx-auto"
          >
            Terminal Return
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10" data-aos="fade-down">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm mb-6 inline-block">
                Technical Syllabus ID: {course.id}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: course.title }}>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                Unlock professional-grade mastery through our advanced technical curriculum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 pb-40">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <div className="relative rounded-[3rem] overflow-hidden shadow-premium group" data-aos="fade-up">
              <img
                src={`http://localhost:5000/${course.image || "Uploads/courses/default.jpg"}`}
                alt={course.title}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>

            <div className="glass rounded-[3rem] p-10 border border-white shadow-xl" data-aos="fade-up">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                Curriculum Specification
              </h2>
              <div
                className="text-slate-600 prose prose-lg prose-teal max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            {course.learning_outcomes && (
              <div className="glass rounded-[3rem] p-10 border border-white shadow-xl" data-aos="fade-up">
                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  Deployment Outcomes
                </h2>
                <div
                  className="text-slate-600 prose prose-lg prose-teal max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.learning_outcomes }}
                />
              </div>
            )}

            <div
              className="group glass rounded-[3rem] p-10 border border-white shadow-xl hover:shadow-2xl transition-all duration-300"
              data-aos="fade-up"
            >
              <h2 className="text-3xl font-black text-slate-900 mb-8">Lead Architect</h2>
              <div className="flex items-center gap-8 cursor-pointer" onClick={handleTeacherClick}>
                <div className="relative">
                  <img
                    src={`http://localhost:5000/uploads/${course.trainer_image || "teachers/default.jpg"}`}
                    alt={course.trainer_name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-2 rounded-full shadow-lg">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                    {course.trainer_name}
                  </h3>
                  <p className="text-teal-600 font-bold uppercase tracking-widest text-xs mt-1">
                    Senior Faculty Specialist
                  </p>
                  <button className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-4 hover:text-teal-600 transition-colors">
                    Examine Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div className="glass rounded-[3rem] p-10 border border-white shadow-xl sticky top-28" data-aos="fade-left">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Training Intel</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commencement</p>
                    <p className="font-bold text-slate-700">{schedule?.start_date ? formatDateTime(schedule.start_date).split('at')[0] : "TBA"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Schedule</p>
                    <p className="font-bold text-slate-700">{schedule?.timing || "TBA"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Venue</p>
                    <p className="font-bold text-slate-700">{schedule?.venue || "Hybrid / Virtual"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
                  <div className="text-center p-4 bg-slate-50 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="font-black text-slate-800">{course.duration || "N/A"}</p>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-3xl">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Fee</p>
                    <p className="font-black text-teal-700">{course.fees || "N/A"}</p>
                  </div>
                </div>

                <button
                  onClick={handleEnrollClick}
                  className="w-full btn-primary py-5 text-lg shadow-xl shadow-teal-600/20 flex items-center justify-center gap-3 group/btn mt-8"
                >
                  Initiate Enrollment
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollBtn />
      <ToastContainer />
    </div>
  );
}

export default CourseDetail;
