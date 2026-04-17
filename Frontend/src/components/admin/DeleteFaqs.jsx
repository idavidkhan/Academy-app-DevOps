import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from '../../config';

function DeleteFaqs() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/faqs`);
      setFaqs(res.data);
    } catch (err) {
      console.error("Error fetching FAQs", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/faqs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(faqs.filter((faq) => faq.id !== id));
      alert("FAQ deleted successfully!");
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
      alert("Error deleting FAQ.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage FAQs</h2>
        <Link
          to="/admin/faqs/add"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          + Add FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p className="text-gray-500 text-center">No FAQs available.</p>
      ) : (
        <ul className="space-y-4">
          {faqs.map((faq) => (
            <li
              key={faq.id}
              className="p-4 bg-white border border-teal-100 rounded shadow"
            >
              <h3 className="font-semibold text-teal-700 mb-1">
                {faq.question}
              </h3>
              <div
                className="text-gray-700 text-sm prose max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              ></div>
              <div className="mt-3 space-x-3">
                <Link
                  to={`/admin/faqs/edit/${faq.id}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeleteFaqs;
