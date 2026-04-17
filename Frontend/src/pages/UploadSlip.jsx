import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../config';

const UploadSlip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [slip, setSlip] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const verifiedRegistration = location.state?.verifiedRegistration || null;
  const API_URL = BASE_URL;

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        console.log("Fetching bank details from:", `${API_URL}/api/bank-info`);
        const res = await axios.get(`${API_URL}/api/bank-info`);
        console.log("Fetched bank details:", res.data);
        setBankDetails(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bank details:", err.response?.data || err.message);
        toast.error(`Failed to load bank details: ${err.response?.data?.error || err.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
      }
    };
    fetchBankDetails();
  }, []);

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, GIF, or PDF files only.", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large. Please upload a file smaller than 5MB.", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSlip(file);
      toast.success("File selected successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      e.target.value = null; // Reset file input
      setSlip(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slip) {
      toast.error("Please select a file to upload", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    if (!verifiedRegistration?.id) {
      toast.error("No verified registration found. Please verify first.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/verify-registration", {
        state: { application_id: location.state?.application_id }
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("slip", slip);

    try {
      console.log("Uploading slip to:", `${API_URL}/api/registrations/upload-slip/${verifiedRegistration.id}`);
      const response = await axios.post(
        `${API_URL}/api/registrations/upload-slip/${verifiedRegistration.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("Upload progress:", percentCompleted + "%");
          },
        }
      );

      console.log("Upload response:", response.data);
      toast.success(response.data.message || "Slip uploaded successfully!", {
        position: "top-right",
        autoClose: 3000
      });

      // Navigate to status check after successful upload
      setTimeout(() => {
        navigate("/check-status", {
          state: { email: verifiedRegistration.email }
        });
      }, 4000);

    } catch (err) {
      console.error("Error uploading slip:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || "Upload failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Retrieving Bank Protocols...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Upload <span className="text-teal-600">Payment Slip</span>
          </h2>
          <p className="text-slate-600 font-medium max-w-xl mx-auto">Complete your registration by providing proof of deposit into the TRESCOL official account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Bank Details Card */}
          <div className="glass rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-teal-600 rounded-full"></span>
              Official Account
            </h3>

            {bankDetails ? (
              <div className="space-y-6">
                <div className="bg-teal-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group/card">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform">
                    <i className="fas fa-university text-6xl"></i>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Commercial Bank Credentials</p>

                  <div className="space-y-4">
                    <div className="flex flex-col border-b border-white/10 pb-3">
                      <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">Bank Name</span>
                      <span className="font-bold text-lg">{bankDetails.bank_name}</span>
                    </div>
                    <div className="flex flex-col border-b border-white/10 pb-3">
                      <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">Account Title</span>
                      <span className="font-bold text-lg">{bankDetails.account_title}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest">Account Number</span>
                      <span className="font-bold text-xl tracking-wider font-mono">{bankDetails.account_number}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-white/50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">IBAN Reference</p>
                    <p className="font-mono font-bold text-slate-900 text-sm">{bankDetails.iban}</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branch Location</p>
                    <p className="font-bold text-slate-900 text-sm">{bankDetails.branch_code} - {bankDetails.branch_address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-red-600 font-bold">System offline. Please contact support.</p>
              </div>
            )}
          </div>

          {/* Upload Form Card */}
          <div className="space-y-6">
            {verifiedRegistration ? (
              <div className="glass rounded-[2.5rem] p-10 shadow-2xl border border-white">
                <div className="mb-8">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Verified Enrollment</p>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {verifiedRegistration.course_title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">Application ID: <span className="font-bold text-slate-700">{verifiedRegistration.application_id}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider ml-1">
                      Evidence of Deposit
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="slip-upload"
                        required
                        disabled={uploading}
                      />
                      <label
                        htmlFor="slip-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:border-teal-400 hover:shadow-xl transition-all duration-300 cursor-pointer group/label"
                      >
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover/label:scale-110 transition-transform">
                            <i className="fas fa-cloud-upload-alt text-2xl"></i>
                          </div>
                          <p className="text-sm font-black text-slate-700 mb-1">
                            {slip ? slip.name : "Select Document"}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            JPG, PNG or PDF (Max 5.0 MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {slip && (
                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-center gap-4 animate-fadeIn">
                      <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-teal-900">Document Ready</p>
                        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">{(slip.size / 1024 / 1024).toFixed(2)} MB • Confirmed</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || !slip}
                    className="w-full btn-primary py-4 text-lg shadow-xl shadow-teal-600/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing Secure Upload...
                      </>
                    ) : (
                      <>
                        Submit to Registrar
                        <span className="text-xl">→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass rounded-[2.5rem] p-12 shadow-2xl text-center border border-red-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 text-3xl">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Verification Found</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-xs">We couldn't find a validated registration session. Please verify your application first.</p>
                <button
                  onClick={() => navigate("/verify-registration")}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
                >
                  Return to Verification
                  <span className="text-xl">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UploadSlip;