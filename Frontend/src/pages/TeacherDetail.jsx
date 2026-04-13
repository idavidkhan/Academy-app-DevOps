import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTeacherContext } from "../context/TeacherContext";
import Footer from "../components/Footer";
import ScrollBtn from "../components/ScrollBtn";
import DOMPurify from "dompurify";
import { Linkedin, Twitter, Github, Facebook, User, ArrowLeft, Mail, Globe, Award } from "lucide-react";

function TeacherDetail() {
  const { id } = useParams();
  const { teachers } = useTeacherContext();
  const location = useLocation();
  const navigate = useNavigate();
  const teacher = location.state?.teacher || teachers.find((t) => t.id === id);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center glass p-20 rounded-[3rem] border border-white shadow-2xl">
          <p className="text-slate-400 font-bold text-xl mb-6">Faculty profile not found.</p>
          <button
            onClick={() => navigate("/teachers")}
            className="btn-primary px-8 py-4 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Faculty
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="py-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10" data-aos="fade-down">
          <button
            onClick={() => navigate("/teachers")}
            className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-12 hover:text-teal-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Faculty Roster
          </button>

          <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              {teacher.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 pb-40">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Static Sidebar */}
          <div className="w-full lg:w-1/3 space-y-8" data-aos="fade-right">
            <div className="relative rounded-[3rem] overflow-hidden shadow-premium group">
              <img
                src={`http://localhost:5000/uploads/${teacher.image || "default.jpg"}`}
                alt={teacher.name}
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className="glass rounded-[3rem] p-10 border border-white shadow-xl space-y-8">
              <div>
                <p className="text-teal-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Primary Designation</p>
                <h3 className="text-2xl font-black text-slate-900">{teacher.designation || "Senior Faculty"}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-600">{teacher.languages || "English, Urdu"}</span>
                </div>
                {/* Add more if needed */}
              </div>

              <div className="pt-8 border-t border-slate-100 flex gap-4 justify-center md:justify-start">
                {teacher.linkedin && (
                  <a href={teacher.linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {teacher.twitter && (
                  <a href={teacher.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {teacher.github && (
                  <a href={teacher.github} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Biography and More */}
          <div className="w-full lg:w-2/3 space-y-12" data-aos="fade-left">
            <div className="glass rounded-[3rem] p-12 border border-white shadow-xl">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                Professional Narrative
              </h2>
              <div
                className="text-slate-600 prose prose-lg prose-teal max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: teacher.bio || "<p>Detailed professional history pending deployment.</p>",
                }}
              />
            </div>

            {teacher.specialties && (
              <div className="glass rounded-[3rem] p-12 border border-white shadow-xl">
                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  Core Competencies
                </h2>
                <div
                  className="text-slate-600 prose prose-lg prose-teal max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: teacher.specialties,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollBtn />
    </div>
  );
}

export default TeacherDetail;
