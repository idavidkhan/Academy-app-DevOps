import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../config';

const AddContactInfo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    email: "",
    support_email: "",
    office_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    country: "",
    working_days: "",
    weekend: "",
    map_location: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    github: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before submission:", form); // Debug log
    try {
      await axios.post(`${BASE_URL}/api/contact-info`, form);
      alert("Contact info added successfully!");
      navigate("/admin/contact");
    } catch (error) {
      console.error(
        "Failed to add contact info:",
        error.response?.data || error
      );
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Add Contact Information</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-3 border rounded w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="support_email" className="block mb-1 font-medium">
            Support Email
          </label>
          <input
            type="email"
            name="support_email"
            id="support_email"
            placeholder="Support Email"
            value={form.support_email}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="office_name" className="block mb-1 font-medium">
            Office Name
          </label>
          <input
            type="text"
            name="office_name"
            id="office_name"
            placeholder="Office Name"
            value={form.office_name}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="address_line1" className="block mb-1 font-medium">
            Address Line 1
          </label>
          <input
            type="text"
            name="address_line1"
            id="address_line1"
            placeholder="Address Line 1"
            value={form.address_line1}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="address_line2" className="block mb-1 font-medium">
            Address Line 2
          </label>
          <input
            type="text"
            name="address_line2"
            id="address_line2"
            placeholder="Address Line 2"
            value={form.address_line2}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="city" className="block mb-1 font-medium">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="country" className="block mb-1 font-medium">
            Country
          </label>
          <input
            type="text"
            name="country"
            id="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="working_days" className="block mb-1 font-medium">
            Working Days
          </label>
          <input
            type="text"
            name="working_days"
            id="working_days"
            placeholder="e.g. Mon–Fri: 9AM–5PM"
            value={form.working_days}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="weekend" className="block mb-1 font-medium">
            Weekend
          </label>
          <input
            type="text"
            name="weekend"
            id="weekend"
            placeholder="e.g. Sat–Sun: Closed"
            value={form.weekend}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="map_location" className="block mb-1 font-medium">
            Map Location (Google Maps Embed URL)
          </label>
          <input
            type="text"
            name="map_location"
            id="map_location"
            placeholder="e.g. https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212779.51526298356!2d72.85333574290554!3d33.56169151910167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df948974419acb%3A0x984357e1632d30f!2sRawalpindi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1753084428106!5m2!1sen!2s"
            value={form.map_location}
            onChange={handleChange}
            className="p-3 border rounded w-full"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter only the Google Maps embed URL (copy the 'src' value from the 'Share or embed map' option on Google Maps).
          </p>
        </div>
        <div>
          <label className="block mb-1 font-medium">Facebook</label>
          <input
            type="text"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Twitter</label>
          <input
            type="text"
            name="twitter"
            value={form.twitter}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">GitHub</label>
          <input
            type="text"
            name="github"
            value={form.github}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded shadow w-full"
          >
            Add Contact Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContactInfo;