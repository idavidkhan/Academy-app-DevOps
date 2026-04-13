import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DeleteContactInfo = () => {
  const [contact, setContact] = useState(null);

  const fetchContact = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact-info");
      setContact(res.data);
    } catch (err) {
      console.error("Failed to fetch contact info", err);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact info?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/contact-info/${contact.id}`
      );
      alert("Contact info deleted");
      setContact(null); // Reset state to show Add button
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
      {contact && Object.keys(contact).length > 0 ? (
        <div className="bg-white shadow p-6 rounded-lg space-y-2">
          <p>
            <strong>Phone:</strong> {contact.phone}
          </p>
          <p>
            <strong>Email:</strong> {contact.email}
          </p>
          <p>
            <strong>Support Email:</strong> {contact.support_email}
          </p>
          <p>
            <strong>Office:</strong> {contact.office_name}
          </p>
          <p>
            <strong>Address:</strong> {contact.address_line1},{" "}
            {contact.address_line2},<br />
            {contact.city}, {contact.country}
          </p>
          <p>
            <strong>Working Days:</strong> {contact.working_days}
          </p>
          <p>
            <strong>Weekend:</strong> {contact.weekend}
          </p>
          <p>
            <strong>Map:</strong> {contact.map_location}
          </p>
          <p>
            <strong>Facebook:</strong> {contact.facebook}
          </p>
          <p>
            <strong>LinkedIn:</strong> {contact.linkedin}
          </p>
          <p>
            <strong>Twitter:</strong> {contact.twitter}
          </p>
          <p>
            <strong>GitHub:</strong> {contact.github}
          </p>
          <div className="pt-6 flex gap-4">
            <Link
              to="/admin/edit-contact"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded shadow"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-600">No contact info found.</p>
          <Link
            to="/admin/add-contact"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded shadow"
          >
            Add Contact Info
          </Link>
        </div>
      )}
    </div>
  );
};

export default DeleteContactInfo;