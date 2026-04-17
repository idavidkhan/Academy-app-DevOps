import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FroalaEditor from "react-froala-wysiwyg";

// Froala CSS & JS
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/themes/gray.min.css";
import { BASE_URL } from '../../config';

function EditTeacher() {
  const { id } = useParams();
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
    existingImage: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/teachers/${id}`);
        const teacher = res.data;
        setFormData({
          name: teacher.name || "",
          designation: teacher.designation || "",
          bio: teacher.bio || "",
          languages: teacher.languages || "",
          specialties: teacher.specialties || "",
          linkedin: teacher.linkedin || "",
          twitter: teacher.twitter || "",
          facebook: teacher.facebook || "",
          github: teacher.github || "",
          image: null,
          existingImage: teacher.image || "",
        });
        if (teacher.image) {
          setPreviewImage(`${BASE_URL}/uploads/${teacher.image}`);
        }
      } catch (err) {
        console.error(
          "Failed to fetch teacher:",
          err.response?.data || err.message
        );
        alert("Failed to load teacher details.");
      }
    };

    fetchTeacher();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(file ? URL.createObjectURL(file) : "");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBioChange = (content) => {
    setFormData((prev) => ({ ...prev, bio: content }));
  };

  const handleSpecialtiesChange = (content) => {
    setFormData((prev) => ({ ...prev, specialties: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "image" && key !== "existingImage") {
        data.append(key, value);
      }
    });

    if (formData.image) {
      data.append("image", formData.image);
    } else {
      data.append("existingImage", formData.existingImage || "");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/teachers/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Teacher updated successfully!");
      navigate("/admin/teachers");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Error updating teacher.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Teacher</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter teacher's full name"
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="e.g., Senior Trainer, Web Developer"
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Bio</label>
          <FroalaEditor
            tag="textarea"
            model={formData.bio}
            onModelChange={handleBioChange}
            config={{
              theme: "gray",
              placeholderText: "Write teacher bio here...",
              heightMin: 150,
              toolbarButtons: [
                "bold",
                "italic",
                "underline",
                "|",
                "formatOL",
                "formatUL",
                "|",
                "insertLink",
                "insertImage",
                "|",
                "undo",
                "redo",
                "html",
              ],
              quickInsertEnabled: false,
              charCounterCount: true,
            }}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Languages</label>
          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            placeholder="e.g., English, Urdu, Arabic"
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Specialties</label>
          <FroalaEditor
            tag="textarea"
            model={formData.specialties}
            onModelChange={handleSpecialtiesChange}
            config={{
              theme: "gray",
              placeholderText: "e.g., Frontend Development, AI, DevOps",
              heightMin: 120,
              toolbarButtons: [
                "bold",
                "italic",
                "underline",
                "|",
                "formatOL",
                "formatUL",
                "|",
                "undo",
                "redo",
                "html",
              ],
              quickInsertEnabled: false,
              charCounterCount: true,
            }}
          />
        </div>

        {["linkedin", "twitter", "facebook", "github"].map((field) => (
          <div key={field}>
            <label className="block font-semibold mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field} profile link`}
              className="p-2 border rounded w-full"
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold mb-1">Teacher Image</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mb-2"
            />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          Update Teacher
        </button>
      </form>
    </div>
  );
}

export default EditTeacher;
