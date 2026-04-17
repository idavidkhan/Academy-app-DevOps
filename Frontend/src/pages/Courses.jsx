import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useScheduleContext } from "../context/ScheduleContext";
import { useCourseContext } from "../context/CourseContext";
import Footer from "../components/Footer";
import ScrollBtn from "../components/ScrollBtn";
import { Calendar, Clock, MapPin, DollarSign, ChevronRight, User } from "lucide-react";
import { BASE_URL } from '../config';

function Courses() {
  const { schedules } = useScheduleContext();
  const { courses } = useCourseContext();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  const today = new Date();

  // Filter only valid (not expired) schedules
  const validSchedules =
    schedules?.filter((schedule) => {
      const endDate = new Date(schedule.end_date);
      return endDate >= today;
    }) || [];

  // Filter courses: keep only
  // - courses with valid schedules
  // - OR courses that are unscheduled
  const filteredCourses =
    courses?.filter((course) => {
      const hasSchedule = schedules?.some((s) => s.course_id === course.id);
      const hasValidSchedule = validSchedules?.some(
        (s) => s.course_id === course.id
      );
      return !hasSchedule || hasValidSchedule;
    }) || [];

  // Sort: show scheduled courses first
  const sortedCourses = filteredCourses.sort((a, b) => {
    const aScheduled = validSchedules.some((s) => s.course_id === a.id);
    const bScheduled = validSchedules.some((s) => s.course_id === b.id);
    return bScheduled - aScheduled;
  });

  // Format datetime to string
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

  const handleRegister = (course) => {
    navigate(`/course-detail/${course.id}`, { state: { course } });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10" data-aos="fade-down">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Advanced <span className="text-teal-600">Curriculums</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Professional certifications and specialized training programs designed to forge the next generation of technical leaders.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 pb-40">
        {sortedCourses.length === 0 ? (
          <div className="text-center py-32 glass rounded-[3rem] border border-slate-100">
            <p className="text-slate-400 font-bold text-xl">No active training missions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sortedCourses.map((course) => {
              const schedule = validSchedules.find((s) => s.course_id === course.id);
              return (
                <div
                  key={course.id}
                  className="group flex flex-col bg-white rounded-[2.5rem] shadow-premium border border-slate-100 hover:border-teal-200 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  data-aos="fade-up"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={`${BASE_URL}/${course.image || "uploads/courses/default.jpg"}`}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 right-6">
                      <span className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg ${schedule ? "bg-teal-600 text-white" : "bg-slate-900 text-white opacity-80"}`}>
                        {schedule ? "Enrollment Open" : "Available Soon"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-teal-600 transition-colors" dangerouslySetInnerHTML={{ __html: course.title }}>
                    </h3>

                    <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <img
                        src={`${BASE_URL}/uploads/${course.trainer_image || "teachers/default.jpg"}`}
                        alt={course.trainer_name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mb-1">Lead Architect</p>
                        <p className="text-sm font-bold text-slate-700">{course.trainer_name}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-teal-500 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commencement</p>
                          <p className="text-sm font-bold text-slate-700">
                            {schedule ? formatDateTime(schedule.start_date).split('at')[0] : "TBA"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-teal-500 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Venue</p>
                          <p className="text-sm font-bold text-slate-700">{schedule?.venue || "Hybrid / Virtual"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 mt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{course.duration || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-bold text-teal-600">{course.fees || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRegister(course)}
                      className="w-full btn-primary py-4 text-lg shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2 group/btn"
                    >
                      Analyze Syllabus
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <ScrollBtn />
      <Footer />
    </div>
  );
}

export default Courses;
