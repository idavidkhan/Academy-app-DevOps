import React, { useState } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddNews() {
  const [formData, setFormData] = useState({
    author: "",
    category: "",
    title: "",
    title_tag: "",
    duration: "",
    meta_description: "",
    written_by: "",
    content: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFroalaChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/news", data);
      alert("News added successfully!");
      navigate("/admin/news");
    } catch (error) {
      console.error(
        "Failed to add news:",
        error.response?.data || error.message
      );
      alert(
        "Error adding news: " + (error.response?.data?.details || error.message)
      );
    }
  };

  // Helper to format field name for label/placeholder
  const formatLabel = (field) =>
    field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add News</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          "author",
          "category",
          "title",
          "title_tag",
          "duration",
          "meta_description",
          "written_by",
        ].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-semibold">
              {formatLabel(field)}
            </label>
            <input
              type="text"
              name={field}
              placeholder={formatLabel(field)}
              value={formData[field] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <FroalaEditor
            tag="textarea"
            model={formData.content || ""}
            onModelChange={handleFroalaChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddNews;
