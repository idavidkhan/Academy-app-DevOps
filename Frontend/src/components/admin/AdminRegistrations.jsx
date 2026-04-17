import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../../config';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = BASE_URL;

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view registrations", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/admin/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log("Fetching registrations from:", `${API_URL}/api/registrations`);
      const res = await axios.get(`${API_URL}/api/registrations`, config);
      console.log("Fetched registrations:", res.data);
      setRegistrations(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching registrations:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Unauthorized: Please log in again", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else {
        toast.error(`Failed to load registrations: ${err.response?.data?.error || err.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [navigate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to update status", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/admin/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log("Updating status for ID:", id, "to:", newStatus);
      await axios.put(`${API_URL}/api/registrations/${id}`, { status: newStatus }, config);
      setRegistrations(
        registrations.map((reg) =>
          reg.id === id ? { ...reg, status: newStatus } : reg
        )
      );
      toast.success("Status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Unauthorized: Please log in again", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else {
        toast.error(`Failed to update status: ${err.response?.data?.error || err.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading registrations...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 p-8 bg-white shadow-lg rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center text-teal-600">Registration Management</h2>
        <button
          onClick={fetchRegistrations}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          Refresh
        </button>
      </div>
      {registrations.length === 0 ? (
        <p className="text-center text-gray-600">No registrations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-teal-100">
                <th className="px-4 py-2 text-left text-teal-700">ID</th>
                <th className="px-4 py-2 text-left text-teal-700">Name</th>
                <th className="px-4 py-2 text-left text-teal-700">Email</th>
                <th className="px-4 py-2 text-left text-teal-700">Phone</th>
                <th className="px-4 py-2 text-left text-teal-700">CNIC</th>
                <th className="px-4 py-2 text-left text-teal-700">Application ID</th>
                <th className="px-4 py-2 text-left text-teal-700">Skills</th>
                <th className="px-4 py-2 text-left text-teal-700">Last Degree</th>
                <th className="px-4 py-2 text-left text-teal-700">Course</th>
                <th className="px-4 py-2 text-left text-teal-700">Slip</th>
                <th className="px-4 py-2 text-left text-teal-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{reg.id}</td>
                  <td className="px-4 py-2">{reg.name}</td>
                  <td className="px-4 py-2">{reg.email}</td>
                  <td className="px-4 py-2">{reg.phone}</td>
                  <td className="px-4 py-2">{reg.cnic || "N/A"}</td>
                  <td className="px-4 py-2">{reg.application_id || "N/A"}</td>
                  <td className="px-4 py-2">{reg.skills}</td>
                  <td className="px-4 py-2">{reg.last_degree}</td>
                  <td className="px-4 py-2">{reg.course_title}</td>
                  <td className="px-4 py-2">
                    {reg.slip ? (
                      <a
                        href={`${API_URL}/uploads/slips/${reg.slip}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                      >
                        View Slip
                      </a>
                    ) : (
                      "No Slip"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={reg.status}
                      onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminRegistrations;