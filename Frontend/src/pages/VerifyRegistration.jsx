import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cnic, setCnic] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [verifiedRegistration, setVerifiedRegistration] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleVerify = async (e) => {
    e.preventDefault();
    const cnicPattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;

    if (!cnic && !applicationId) {
      toast.error("Please enter CNIC or Application ID", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (cnic && !cnicPattern.test(cnic)) {
      toast.error("Invalid CNIC format. Use XXXXX-XXXXXXX-X", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      console.log("Verifying registration with:", { cnic, application_id: applicationId });
      const res = await axios.post(
        `${API_URL}/api/registrations/verify`,
        { cnic, application_id: applicationId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Verification response:", res.data);
      setVerifiedRegistration(res.data);

      // Store verified registration in localStorage
      localStorage.setItem("verifiedRegistration", JSON.stringify(res.data));

      // Determine redirection based on status
      const status = res.data.status;
      let redirectPath = "/upload-slip";
      let state = {
        verifiedRegistration: res.data,
        email: res.data.email,
        application_id: res.data.application_id,
      };

      if (status !== "Payment Pending") {
        redirectPath = "/check-status";
        state = { email: res.data.email };
        toast.success("Registration already verified. Redirecting to check status...", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success("Registration verified! Redirecting to upload slip...", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setTimeout(() => {
        navigate(redirectPath, { state });
      }, 4000);
    } catch (err) {
      console.error("Error verifying registration:", err.response?.data || err.message);
      toast.error(
        `Verification failed: ${err.response?.data?.error || err.message || "Server error"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-teal-600">Verify Registration</h2>
      {location.state?.application_id && (
        <p className="mb-2 text-gray-600">
          Your Application ID: <strong>{location.state.application_id}</strong>
        </p>
      )}
      <p className="mb-2 text-gray-600">
        Please enter your CNIC or Application ID to verify your registration.
      </p>
      <form onSubmit={handleVerify} className="mb-4">
        <div className="mb-2">
          <label className="block mb-1 font-medium">CNIC</label>
          <input
            type="text"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="12345-1234567-1"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-medium">Application ID</label>
          <input
            type="text"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter Application ID (e.g., REG-20250723-1234)"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
        >
          Verify
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VerifyRegistration;