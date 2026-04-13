import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    trainer_id: "", // Use trainer_id instead of trainer_name
    description: "",
    duration: "",
    fees: "",
    learning_outcomes: "",
    existingImage: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [teachers, setTeachers] = useState([]);


  useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    }
  };
  fetchTeachers();
}, []);


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        const course = res.data;

        setForm({
          title: course.title || "",
          trainer_id: course.trainer_id || "",
          description: course.description || "",
          duration: course.duration || "",
          fees: course.fees || "",
          learning_outcomes: course.learning_outcomes || "",
          existingImage: course.image || "",
        });

        setPreviewImage(`http://localhost:5000/${course.image}`);
      } catch (err) {
        alert(
          "Failed to load course: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teachers");
        setTeachers(res.data);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      }
    };

    fetchCourse();
    fetchTeachers();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImage(files[0]);
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFroalaChange = (field) => (value) => {
    setForm({ ...form, [field]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== "existingImage") {
          formData.append(key, value || "");
        }
      });

      formData.append("existingImage", form.existingImage || "");
      if (image) formData.append("image", image);

      await axios.put(`http://localhost:5000/api/courses/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Course updated successfully");
      navigate("/admin/courses");
    } catch (err) {
      alert(
        "Failed to update course: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto mt-10 bg-gray-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Course</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            className="w-full p-2 border"
            type="text"
            name="title"
            placeholder="Enter course title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Select Trainer</label>
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

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <FroalaEditor
            tag="textarea"
            model={form.description}
            onModelChange={handleFroalaChange("description")}
            config={{
              placeholderText: "Write course description...",
              heightMin: 200,
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">What You'll Learn</label>
          <FroalaEditor
            tag="textarea"
            model={form.learning_outcomes}
            onModelChange={handleFroalaChange("learning_outcomes")}
            config={{
              placeholderText: "List learning outcomes...",
              heightMin: 150,
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Duration</label>
          <input
            className="w-full p-2 border"
            type="text"
            name="duration"
            placeholder="e.g. 3 weeks"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Fees</label>
          <input
            className="w-full p-2 border"
            type="text"
            name="fees"
            placeholder="e.g. PKR 5,000"
            value={form.fees}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Course Image</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-20 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border"
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Update Course
        </button>
      </form>
    </div>
  );
}

export default EditCourse;