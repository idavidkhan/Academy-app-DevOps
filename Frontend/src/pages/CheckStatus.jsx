import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../config';

const CheckStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = BASE_URL;

  const validateCnic = (cnic) => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  };

  const fetchStatus = async () => {
    if (!email && !cnic) {
      toast.error("Please enter Email or CNIC", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (cnic && !validateCnic(cnic)) {
      toast.error("Invalid CNIC format. Use XXXXX-XXXXXXX-X", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      let url;

      if (email) {
        url = `${API_URL}/api/registrations/status/${encodeURIComponent(email)}`;
      } else {
        url = `${API_URL}/api/registrations/status/cnic-or-appid/${encodeURIComponent(
          cnic || "null"
        )}/null`;
      }

      const res = await axios.get(url);
      setData(res.data);

      if (res.data.length === 0) {
        toast.info("No registrations found", { position: "top-right", autoClose: 3000 });
      } else {
        const item = res.data[0];
        if (item.status === "Payment Pending") {
          toast.info("Please make payment and upload your slip.", {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/upload-slip", {
              state: {
                verifiedRegistration: item,
                email: item.email,
                application_id: item.application_id,
              },
            });
          }, 4000);
        } else if (item.status === "Pending") {
          toast.info("Payment verification is pending. Please wait for admin approval.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else if (item.status === "Verified") {
          toast.success(`Your registration for "${item.course_title}" is verified!`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else if (item.status === "Rejected") {
          toast.error(`Your registration for "${item.course_title}" was rejected.`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (err) {
      toast.error(`Failed to fetch status: ${err.response?.data?.error || err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchStatus();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Payment Pending":
        return "bg-yellow-500 text-white px-3 py-1 rounded font-medium text-sm";
      case "Pending":
        return "bg-orange-500 text-white px-3 py-1 rounded font-medium text-sm";
      case "Verified":
        return "bg-green-600 text-white px-3 py-1 rounded font-medium text-sm";
      case "Rejected":
        return "bg-red-500 text-white px-3 py-1 rounded font-medium text-sm";
      default:
        return "bg-gray-400 text-white px-3 py-1 rounded font-medium text-sm";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-2xl mx-auto glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fadeIn">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Check <span className="text-teal-600">Status</span>
          </h2>
          <p className="text-slate-600 font-medium">Enter your details to track your registration progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="registered@example.com"
              />
            </div>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-black uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">CNIC / App ID</label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="input"
                placeholder="12345-1234567-1 or TRES-XXXX"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg shadow-xl shadow-teal-600/20"
            disabled={loading}
          >
            {loading ? "querying TRESCOL database..." : "Check My Status"}
          </button>
        </form>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-bold animate-pulse">Synchronizing Data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium">No records found for the provided information.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.map((item) => (
                <div key={item.id} className="relative group overflow-hidden bg-white rounded-[2rem] p-8 shadow-premium border border-slate-100 hover:border-teal-200 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                      <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1">Application Reference</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">{item.application_id || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest ${getStatusClass(item.status)} shadow-lg shadow-current/10`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {item.status === "Payment Pending" && (
                    <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 animate-fadeIn">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 text-amber-700 font-black">!</div>
                      <p className="text-sm text-amber-800 leading-relaxed font-medium">
                        Payment verification required. Please upload your deposit slip in the <strong className="text-amber-900">Upload Center</strong> to finalize your enrollment.
                      </p>
                    </div>
                  )}

                  {item.status === "Verified" && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Course</p>
                        <p className="font-bold text-slate-900 text-sm">{item.course_title}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Instructor</p>
                        <p className="font-bold text-slate-900 text-sm">{item.trainer}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Venue</p>
                        <p className="font-bold text-slate-900 text-sm">{item.venue}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                        <p className="font-bold text-slate-900 text-sm">{item.timing}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                        <p className="font-bold text-slate-900 text-sm">{item.duration}</p>
                      </div>
                      <div className="p-4 bg-teal-600 rounded-2xl shadow-lg shadow-teal-600/20">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Registration</p>
                        <p className="font-bold text-white text-sm">Full Confirmed</p>
                      </div>

                      {item.certificate_path && (
                        <div className="md:col-span-2 lg:col-span-3 mt-4">
                          <a
                            href={`${API_URL}/${item.certificate_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full p-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-transform"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download Your Certificate
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CheckStatus;