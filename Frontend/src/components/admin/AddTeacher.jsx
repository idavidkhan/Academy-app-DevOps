import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

function AddTeacher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    bio: "",
    languages: "",
    specialties: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    github: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFroalaChange = (field) => (content) => {
    setFormData({ ...formData, [field]: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/teachers", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Teacher added successfully!");
      navigate("/admin/teachers");
    } catch (err) {
      console.error(err);
      alert("Error adding teacher.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Teacher</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Designation */}
        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Designation
          </label>
          <input
            type="text"
            name="designation"
            id="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="e.g. Senior Web Developer"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Bio
          </label>
          <FroalaEditor
            tag="textarea"
            model={formData.bio}
            onModelChange={handleFroalaChange("bio")}
            config={{
              placeholderText: "Write a short bio...",
              heightMin: 150,
            }}
          />
        </div>

        {/* Languages */}
        <div>
          <label
            htmlFor="languages"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Languages
          </label>
          <input
            type="text"
            name="languages"
            id="languages"
            value={formData.languages}
            onChange={handleChange}
            placeholder="e.g. English, Urdu"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Specialties
          </label>
          <FroalaEditor
            tag="textarea"
            model={formData.specialties}
            onModelChange={handleFroalaChange("specialties")}
            config={{
              placeholderText: "List areas of expertise...",
              heightMin: 150,
            }}
          />
        </div>

        {/* Social Links */}
        {[
          {
            name: "linkedin",
            label: "LinkedIn URL",
            placeholder: "https://linkedin.com/in/username",
          },
          {
            name: "twitter",
            label: "Twitter URL",
            placeholder: "https://twitter.com/username",
          },
          {
            name: "facebook",
            label: "Facebook URL",
            placeholder: "https://facebook.com/username",
          },
          {
            name: "github",
            label: "GitHub URL",
            placeholder: "https://github.com/username",
          },
        ].map(({ name, label, placeholder }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              {label}
            </label>
            <input
              type="text"
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Upload Profile Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
        >
          Add Teacher
        </button>
      </form>
    </div>
  );
}

export default AddTeacher;
