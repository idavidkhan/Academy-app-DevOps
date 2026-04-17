import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FroalaEditor from "react-froala-wysiwyg";
import { BASE_URL } from '../../config';

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    existingImage: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/news/${id}`)
      .then((res) => {
        const data = {
          ...res.data,
          existingImage: res.data.image || "",
          image: null,
        };
        setFormData(data);
        if (res.data.image) {
          setPreviewImage(
            `${BASE_URL}/uploads/news/${res.data.image}`
          );
        }
      })
      .catch((err) => {
        console.error("Fetch failed:", err.response?.data || err.message);
        alert(
          "Error fetching news: " + (err.response?.data?.details || err.message)
        );
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(files[0] ? URL.createObjectURL(files[0]) : previewImage);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFroalaChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "existingImage" && key !== "image") {
        updated.append(key, value || "");
      }
    });

    if (formData.image) {
      updated.append("image", formData.image);
    } else {
      updated.append("existingImage", formData.existingImage || "");
    }

    try {
      await axios.put(`${BASE_URL}/api/news/${id}`, updated);
      alert("News updated successfully!");
      navigate("/admin/news");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(
        "Error updating news: " + (err.response?.data?.details || err.message)
      );
    }
  };

  const formatLabel = (field) =>
    field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit News</h2>
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
              value={formData[field] || ""}
              placeholder={formatLabel(field)}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-48 h-32 object-cover mt-2 rounded shadow"
            onError={(e) =>
              console.error(`Preview image failed to load: ${previewImage}`)
            }
          />
        )}

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
          className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default EditNews;
