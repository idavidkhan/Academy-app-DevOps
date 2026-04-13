import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Award, Download, Search } from "lucide-react";

const CertificateDownloader = () => {
    const [email, setEmail] = useState("");
    const [cnic, setCnic] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchCertificates = async () => {
        if (!email && !cnic) {
            toast.error("Please enter Email or CNIC/App ID", {
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
                url = `${API_URL}/api/registrations/status/cnic-or-appid/${encodeURIComponent(cnic)}/null`;
            }

            const res = await axios.get(url);
            // Filter only those that have a certificate
            const certs = res.data.filter(item => item.certificate_path);
            setData(certs);

            if (certs.length === 0) {
                toast.info("No certificates found for the provided information. Make sure your registration is verified and the certificate has been issued.", {
                    position: "top-right",
                    autoClose: 5000
                });
            }
        } catch (err) {
            toast.error(`Failed to fetch certificates: ${err.response?.data?.error || err.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchCertificates();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-3xl mx-auto glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fadeIn">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4 text-teal-600">
                        <Award className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                        Download <span className="text-teal-600">Certificates</span>
                    </h2>
                    <p className="text-slate-600 font-medium max-w-lg mx-auto">
                        Retrieve and download your professional course completion certificates from Trescol Skill.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/50 p-6 rounded-3xl border border-teal-50 mb-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-12 h-14"
                                    placeholder="registered@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">CNIC</label>
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={cnic}
                                    onChange={(e) => setCnic(e.target.value)}
                                    className="input pl-12 h-14"
                                    placeholder="12345-1234567-1"
                                />
                            </div>
                        </div>

                    </div>
                    <button
                        type="submit"
                        className="w-full btn-primary py-4 text-lg shadow-xl shadow-teal-600/20 mt-6 flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : (
                            <>
                                <Search className="w-5 h-5" />
                                Find My Certificates
                            </>
                        )}
                    </button>
                </form>

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center py-12 space-y-4">
                            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-bold animate-pulse">Scanning Certificate Records...</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="text-center py-12 bg-white/30 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium italic">Enter your details above to search for your certificates.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {data.map((item) => (
                                <div key={item.id} className="group relative overflow-hidden bg-white rounded-[2rem] p-8 shadow-premium border border-slate-100 hover:border-teal-200 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                        <div className="flex items-start gap-5">
                                            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                                <Award className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1">Course Completion</p>
                                                <p className="text-xl font-black text-slate-900 leading-tight mb-1">{item.course_title}</p>
                                                <p className="text-sm font-medium text-slate-500">Issued on {new Date(item.certificate_issue_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={`${API_URL}/${item.certificate_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-all hover:-translate-y-1"
                                            >
                                                <Download className="w-5 h-5" />
                                                Download Certificate
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trainer</p>
                                            <p className="font-bold text-slate-700 text-sm">{item.trainer}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference</p>
                                            <p className="font-bold text-slate-700 text-sm">{item.application_id}</p>
                                        </div>
                                    </div>

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

export default CertificateDownloader;
