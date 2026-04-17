import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import { BASE_URL } from '../../config';

function AddCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    trainer_id: "", // Use trainer_id instead of trainer_name
    description: "",
    duration: "",
    fees: "",
    learning_outcomes: "",
  });

  const [image, setImage] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/teachers`);
        setTeachers(res.data);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTeacherSelect = (e) => {
    const selectedId = e.target.value;
    setForm({ ...form, trainer_id: selectedId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload a course image.");
      return;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/courses/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Course added successfully!");
      navigate("/admin/courses");
    } catch (err) {
      alert("Failed to add course: " + err.response?.data?.message);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto mt-10 bg-gray-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            className="w-full p-2 border"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Course title"
            required
          />
        </div>

        {/* Trainer Dropdown */}
        <div className="mb-4">
          <label className="block mb-1">Select Trainer</label>
          <select
            className="w-full p-2 border"
            name="trainer_id"
            value={form.trainer_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Choose a trainer --
            </option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Froala Editor - Description */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <FroalaEditor
            tag="textarea"
            model={form.description}
            onModelChange={(value) => setForm({ ...form, description: value })}
            config={{
              placeholderText: "Write course description...",
              heightMin: 200,
              charCounterCount: true,
              toolbarSticky: true,
            }}
          />
        </div>

        {/* Froala Editor - What You'll Learn */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">What You’ll Learn</label>
          <FroalaEditor
            tag="textarea"
            model={form.learning_outcomes}
            onModelChange={(value) =>
              setForm({ ...form, learning_outcomes: value })
            }
            config={{
              placeholderText: "List the key learning points...",
              heightMin: 150,
            }}
          />
        </div>

        {/* Duration and Fees */}
        {[
          { name: "duration", label: "Duration", placeholder: "e.g. 6 weeks" },
          { name: "fees", label: "Fees", placeholder: "e.g. 5000 PKR" },
        ].map(({ name, label, placeholder }) => (
          <div key={name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <input
              className="w-full p-2 border"
              type="text"
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required
            />
          </div>
        ))}

        {/* Course Image */}
        <div className="mb-4">
          <label className="block mb-1">Course Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          type="submit"
        >
          Submit Course
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
