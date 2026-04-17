import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTeacherContext } from "../context/TeacherContext";
import Footer from "../components/Footer";
import ScrollBtn from "../components/ScrollBtn";
import { Linkedin, Twitter, Github, Facebook, User, ArrowRight } from "lucide-react";
import { BASE_URL } from '../config';

function Teachers() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teachers } = useTeacherContext();
  const teacherData = location.state?.teacherData || teachers;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  const handleKnowMore = (teacher) => {
    navigate(`/teacher-detail/${teacher.id}`, { state: { teacher } });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10" data-aos="fade-down">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Elite <span className="text-teal-600">Faculty</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Our team comprises industry veterans and research pioneers committed to delivering world-class technical education.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 pb-40">
        {teacherData.length === 0 ? (
          <div className="text-center py-32 glass rounded-[3rem] border border-slate-100">
            <p className="text-slate-400 font-bold text-xl">No faculty profiles available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teacherData.map((teacher) => (
              <div
                key={teacher.id}
                className="group flex flex-col bg-white rounded-[3rem] shadow-premium border border-slate-100 hover:border-teal-200 transition-all duration-500 hover:-translate-y-2 overflow-hidden p-4"
                data-aos="fade-up"
              >
                <div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-6">
                  <img
                    src={`${BASE_URL}/uploads/${teacher.image || "default.jpg"}`}
                    alt={teacher.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 gap-4">
                    {teacher.linkedin && (
                      <a href={teacher.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {teacher.twitter && (
                      <a href={teacher.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {teacher.github && (
                      <a href={teacher.github} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 flex flex-col flex-1 text-center">
                  <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight group-hover:text-teal-600 transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-teal-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                    {teacher.designation || "Senior Faculty"}
                  </p>

                  <div
                    className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{
                      __html: teacher.bio || "Detailed professional biography pending deployment.",
                    }}
                  />

                  <button
                    onClick={() => handleKnowMore(teacher)}
                    className="w-full py-4 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-teal-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-slate-100 hover:border-teal-600"
                  >
                    Examine Portfolio
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
      <ScrollBtn />
    </div>
  );
}

export default Teachers;
