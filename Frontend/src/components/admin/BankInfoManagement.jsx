import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BankInfoManagement = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchBankDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view bank details", { position: "top-right", autoClose: 3000 });
        navigate("/admin/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log("Fetching bank details from:", `${API_URL}/api/bank-info/all`);
      const res = await axios.get(`${API_URL}/api/bank-info/all`, config);
      console.log("Fetched bank details:", res.data);
      setBankDetails(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bank details:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Unauthorized: Please log in again", { position: "top-right", autoClose: 3000 });
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else {
        toast.error(`Failed to load bank details: ${err.response?.data?.error || err.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBankDetails();
  }, [fetchBankDetails]);

  const handleDeleteBankDetails = async (BankID) => {
    if (!window.confirm("Are you sure you want to delete this bank info?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to delete bank details", { position: "top-right", autoClose: 3000 });
        navigate("/admin/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log("Deleting bank details:", BankID);
      await axios.delete(`${API_URL}/api/bank-info/${BankID}`, config);
      setBankDetails(bankDetails.filter((b) => b.BankID !== BankID));
      toast.success("Bank info deleted successfully!", { position: "top-right", autoClose: 3000 });
      fetchBankDetails(); // Refresh data after deletion
    } catch (err) {
      console.error("Error deleting bank details:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Unauthorized: Please log in again", { position: "top-right", autoClose: 3000 });
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else {
        toast.error(`Failed to delete bank info: ${err.response?.data?.error || err.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading bank details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 p-8 bg-white shadow-lg rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center text-teal-600">Bank Info Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/admin/add-bank")}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Add Bank Info
          </button>
          <button
            onClick={fetchBankDetails}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>
      {bankDetails.length === 0 ? (
        <p className="text-center text-gray-600">No bank info found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-teal-100">
                <th className="px-4 py-2 text-left text-teal-700">ID</th>
                <th className="px-4 py-2 text-left text-teal-700">Bank Name</th>
                <th className="px-4 py-2 text-left text-teal-700">Account Title</th>
                <th className="px-4 py-2 text-left text-teal-700">Account Number</th>
                <th className="px-4 py-2 text-left text-teal-700">IBAN</th>
                <th className="px-4 py-2 text-left text-teal-700">Branch Code</th>
                <th className="px-4 py-2 text-left text-teal-700">Branch Address</th>
                <th className="px-4 py-2 text-left text-teal-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankDetails.map((bank) => (
                <tr key={bank.BankID} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{bank.BankID}</td>
                  <td className="px-4 py-2">{bank.bank_name}</td>
                  <td className="px-4 py-2">{bank.account_title}</td>
                  <td className="px-4 py-2">{bank.account_number}</td>
                  <td className="px-4 py-2">{bank.iban}</td>
                  <td className="px-4 py-2">{bank.branch_code}</td>
                  <td className="px-4 py-2">{bank.branch_address}</td>
                  <td className="px-4 py-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/admin/edit-bank/${bank.BankID}`)}
                      className="px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBankDetails(bank.BankID)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    </div>
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

export default BankInfoManagement;