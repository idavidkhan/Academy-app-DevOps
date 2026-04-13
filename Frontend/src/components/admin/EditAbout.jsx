import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

const EditAbout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [formData, setFormData] = useState({
    card_heading: "",
    card_paragraph: "",
    trainer_name: "",
    title: "",
    quote: "",
    bio: "",
    image: null,
  });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/about/${id}`);
        const data = res.data;
        setEntry(data);
        setFormData({
          card_heading: data.card_heading || "",
          card_paragraph: data.card_paragraph || "",
          trainer_name: data.trainer_name || "",
          title: data.title || "",
          quote: data.quote || "",
          bio: data.bio || "",
          image: null,
        });
      } catch (err) {
        console.error("Error loading entry:", err);
      }
    };
    fetchEntry();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    try {
      if (entry.section === "founder") {
        data.append("trainer_name", formData.trainer_name);
        data.append("title", formData.title);
        data.append("quote", formData.quote);
        data.append("bio", formData.bio);
        if (formData.image) {
          data.append("image", formData.image);
        }
        await axios.put(`http://localhost:5000/api/about/founder/${id}`, data);
      } else {
        data.append("section", entry.section);
        data.append("card_heading", formData.card_heading);
        data.append("card_paragraph", formData.card_paragraph);
        await axios.put(`http://localhost:5000/api/about/${id}`, data);
      }
      alert("Entry updated successfully!");
      navigate("/admin/about");
    } catch (err) {
      console.error("Error updating entry:", err);
      alert("Failed to update. See console for details.");
    }
  };

  if (!entry) {
    return (
      <div className="text-center py-10 text-teal-600">Loading entry...</div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 capitalize">
        Edit{" "}
        {entry.section === "custom"
          ? "Additional Section"
          : entry.section === "founder"
          ? "Founder"
          : `“${entry.card_heading}”`}{" "}
        Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {entry.section === "founder" ? (
          <>
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="trainer_name"
                value={formData.trainer_name}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Quote</label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block font-medium mb-1">Heading</label>
              <input
                type="text"
                name="card_heading"
                value={formData.card_heading}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Content</label>
              <FroalaEditor
                tag="textarea"
                model={formData.card_paragraph}
                onModelChange={(val) =>
                  setFormData((prev) => ({ ...prev, card_paragraph: val }))
                }
                config={{ heightMin: 200, placeholderText: "Edit content..." }}
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditAbout;
