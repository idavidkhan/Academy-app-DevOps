import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../../config';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [issuing, setIssuing] = useState(false);
    const API_URL = BASE_URL;

    const [form, setForm] = useState({
        registration_id: "",
        certificate_code: "",
        issue_date: new Date().toISOString().split("T")[0],
    });
    const [file, setFile] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Fetch certificates
        try {
            const certsRes = await axios.get(`${API_URL}/api/certificates`, config);
            setCertificates(certsRes.data);
        } catch (err) {
            console.error("Certificates fetch error:", err.message);
            // Ignore error here to allow registrations to load even if server hasn't restarted
        }

        // 2. Fetch registrations
        try {
            const regsRes = await axios.get(`${API_URL}/api/registrations`, config);
            console.log("Raw registrations from API:", regsRes.data);
            const verified = regsRes.data.filter((reg) =>
                reg.status && reg.status.toString().trim().toLowerCase() === "verified"
            );
            console.log("Filtered verified registrations:", verified);
            setRegistrations(verified);
        } catch (err) {
            toast.error("Failed to load registrations: " + (err.response?.data?.message || err.message));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "registration_id" && value) {
            // Generate automatic certificate code: TRES-RegID-Year-Random
            const random = Math.floor(1000 + Math.random() * 9000);
            const year = new Date().getFullYear();
            const autoCode = `TRES-${value}-${year}-${random}`;
            setForm({
                ...form,
                [name]: value,
                certificate_code: autoCode
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload the certificate file.");
            return;
        }

        const selectedReg = registrations.find(r => r.id.toString() === form.registration_id);
        if (!selectedReg) {
            toast.error("Invalid registration selected.");
            return;
        }

        const formData = new FormData();
        formData.append("registration_id", form.registration_id);
        formData.append("course_id", selectedReg.course_id);
        formData.append("certificate_code", form.certificate_code);
        formData.append("issue_date", form.issue_date);
        formData.append("certificate", file);

        try {
            setIssuing(true);
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/api/certificates`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Certificate issued successfully!");
            setForm({ ...form, registration_id: "", certificate_code: "" });
            setFile(null);
            fetchData();
        } catch (err) {
            toast.error("Failed to issue certificate: " + (err.response?.data?.message || err.message));
        } finally {
            setIssuing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this certificate?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/certificates/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Certificate deleted successfully!");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete certificate");
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Issue Certificate Form */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-teal-100">
                <h2 className="text-xl font-bold text-teal-700 mb-6">Issue New Certificate</h2>
                <form onSubmit={handleIssue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Verified Student</label>
                        <select
                            name="registration_id"
                            value={form.registration_id}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                            required
                        >
                            <option value="">-- Select Student --</option>
                            {registrations.map((reg) => (
                                <option key={reg.id} value={reg.id}>
                                    {reg.name} - {reg.course_title} ({reg.application_id})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Code</label>
                        <input
                            type="text"
                            name="certificate_code"
                            value={form.certificate_code}
                            onChange={handleChange}
                            placeholder="e.g. CERT-2024-001"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                        <input
                            type="date"
                            name="issue_date"
                            value={form.issue_date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Image/PDF</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full p-1.5 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                            accept=".jpg,.jpeg,.png,.pdf"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={issuing}
                            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition-colors disabled:bg-gray-400"
                        >
                            {issuing ? "Issuing..." : "Issue Certificate"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Issued Certificates List */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Issued Certificates</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                                <th className="p-3 border-b">Code</th>
                                <th className="p-3 border-b">Student</th>
                                <th className="p-3 border-b">Course</th>
                                <th className="p-3 border-b">Date</th>
                                <th className="p-3 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">No certificates issued yet.</td>
                                </tr>
                            ) : (
                                certificates.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 border-b font-medium">{cert.certificate_code}</td>
                                        <td className="p-3 border-b">
                                            <div className="font-bold">{cert.student_name}</div>
                                            <div className="text-xs text-gray-500">{cert.student_email}</div>
                                        </td>
                                        <td className="p-3 border-b text-sm">{cert.course_title}</td>
                                        <td className="p-3 border-b text-sm">{new Date(cert.issue_date).toLocaleDateString()}</td>
                                        <td className="p-3 border-b space-x-2">
                                            <a
                                                href={`${API_URL}/${cert.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-teal-600 hover:underline text-sm"
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => handleDelete(cert.id)}
                                                className="text-red-500 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Certificates;
