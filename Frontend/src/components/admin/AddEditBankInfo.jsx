import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../../config';

const AddEditBankInfo = () => {
  const navigate = useNavigate();
  const { BankID } = useParams();
  const [initialValues, setInitialValues] = useState({
    bank_name: "",
    account_title: "",
    account_number: "",
    iban: "",
    branch_code: "",
    branch_address: "",
  });
  const API_URL = BASE_URL;

  useEffect(() => {
    if (BankID) {
      const fetchBankDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Please log in to edit bank info", { position: "top-right", autoClose: 3000 });
            navigate("/admin/login");
            return;
          }
          const config = { headers: { Authorization: `Bearer ${token}` } };
          console.log("Fetching bank details for edit:", `${API_URL}/api/bank-info/all`);
          const res = await axios.get(`${API_URL}/api/bank-info/all`, config);
          const bankDetail = res.data.find((b) => b.BankID === parseInt(BankID));
          if (bankDetail) {
            setInitialValues(bankDetail);
          } else {
            toast.error("Bank info not found", { position: "top-right", autoClose: 3000 });
            navigate("/admin/bank-info");
          }
        } catch (err) {
          console.error("Error fetching bank info:", err.response?.data || err.message);
          toast.error(`Failed to load bank info: ${err.response?.data?.error || err.message}`, {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/admin/bank-info");
        }
      };
      fetchBankDetails();
    }
  }, [BankID, navigate]);

  const validationSchema = Yup.object({
    bank_name: Yup.string().required("Bank Name is required"),
    account_title: Yup.string().required("Account Title is required"),
    account_number: Yup.string().required("Account Number is required"),
    iban: Yup.string().required("IBAN is required"),
    branch_code: Yup.string().required("Branch Code is required"),
    branch_address: Yup.string().required("Branch Address is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to save bank info", { position: "top-right", autoClose: 3000 });
        navigate("/admin/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log("Submitting bank info to:", BankID ? `${API_URL}/api/bank-info/${BankID}` : `${API_URL}/api/bank-info`);
      console.log("Form values:", values);
      if (BankID) {
        await axios.put(`${API_URL}/api/bank-info/${BankID}`, values, config);
        toast.success("Bank info updated successfully!", { position: "top-right", autoClose: 3000 });
      } else {
        await axios.post(`${API_URL}/api/bank-info`, values, config);
        toast.success("Bank info added successfully!", { position: "top-right", autoClose: 3000 });
      }
      navigate("/admin/bank-info");
    } catch (err) {
      console.error("Error saving bank info:", err.response?.data || err.message);
      toast.error(`Failed to save bank info: ${err.response?.data?.error || err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">
        {BankID ? "Edit Bank Info" : "Add Bank Info"}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {["bank_name", "account_title", "account_number", "iban", "branch_code", "branch_address"].map((field) => (
              <div key={field}>
                <label className="block mb-1 font-medium capitalize">{field.replace(/_/g, " ")}</label>
                <Field
                  type="text"
                  name={field}
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage name={field} component="div" className="text-red-600 text-sm" />
              </div>
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
            >
              {isSubmitting ? "Saving..." : BankID ? "Update Bank Info" : "Add Bank Info"}
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddEditBankInfo;