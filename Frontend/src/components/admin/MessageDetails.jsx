import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MessageDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">No message data found.</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-300 px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    subject,
    message,
    created_at,
  } = state;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Message Details</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Subject:</strong> {subject}</p>
        <p className="whitespace-pre-wrap"><strong>Message:</strong><br />{message}</p>
        <p className="text-gray-500 text-sm mt-2">
          <strong>Sent:</strong> {new Date(created_at).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default MessageDetails;
