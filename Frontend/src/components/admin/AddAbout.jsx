import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

const AddAbout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionType = new URLSearchParams(location.search).get("section_type") || "main";
  const [existingSections, setExistingSections] = useState([]);
  const [formData, setFormData] = useState({
    mission_paragraph: "",
    vision_paragraph: "",
    why_paragraph: "",
    trainer_name: "",
    title: "",
    quote: "",
    bio: "",
    image: null,
    custom_heading: "",
    custom_paragraph: "",
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/about");
        const sections = res.data.map((entry) => entry.section);
        setExistingSections(sections);
      } catch (err) {
        console.error("Error checking existing About entries:", err);
      }
    };
    fetchSections();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitSection = async (section, heading, paragraph) => {
      const data = new FormData();
      data.append("section", section);
      data.append("card_heading", heading);
      data.append("card_paragraph", paragraph);
      try {
        await axios.post("http://localhost:5000/api/about", data);
      } catch (err) {
        console.error(`Failed to save ${section}`, err);
      }
    };

    if (sectionType === "main") {
      if (!existingSections.includes("mission") && formData.mission_paragraph) {
        await submitSection("mission", "Our Mission", formData.mission_paragraph);
      }
      if (!existingSections.includes("vision") && formData.vision_paragraph) {
        await submitSection("vision", "Our Vision", formData.vision_paragraph);
      }
      if (!existingSections.includes("why") && formData.why_paragraph) {
        await submitSection("why", "Why TRESCOL", formData.why_paragraph);
      }
    } else if (sectionType === "additional" && formData.custom_heading && formData.custom_paragraph) {
      await submitSection("custom", formData.custom_heading, formData.custom_paragraph);
    } else if (sectionType === "founder") {
      const founderData = new FormData();
      founderData.append("section", "founder");
      founderData.append("trainer_name", formData.trainer_name);
      founderData.append("title", formData.title);
      founderData.append("quote", formData.quote);
      founderData.append("bio", formData.bio);
      if (formData.image) founderData.append("image", formData.image);
      try {
        await axios.post("http://localhost:5000/api/about", founderData);
      } catch (err) {
        console.error("Failed to save founder", err);
      }
    }

    alert("About entry added!");
    navigate("/admin/about");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add {sectionType === "main" ? "Mission, Vision, Why" : sectionType === "additional" ? "Additional Section" : "Founder"} Content</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {sectionType === "main" && (
          <>
            {!existingSections.includes("mission") && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                <FroalaEditor
                  tag="textarea"
                  model={formData.mission_paragraph}
                  onModelChange={(val) => setFormData({ ...formData, mission_paragraph: val })}
                  config={{ heightMin: 180, placeholderText: "Write mission content..." }}
                />
              </div>
            )}
            {!existingSections.includes("vision") && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
                <FroalaEditor
                  tag="textarea"
                  model={formData.vision_paragraph}
                  onModelChange={(val) => setFormData({ ...formData, vision_paragraph: val })}
                  config={{ heightMin: 180, placeholderText: "Write vision content..." }}
                />
              </div>
            )}
            {!existingSections.includes("why") && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Why TRESCOL</h3>
                <FroalaEditor
                  tag="textarea"
                  model={formData.why_paragraph}
                  onModelChange={(val) => setFormData({ ...formData, why_paragraph: val })}
                  config={{ heightMin: 180, placeholderText: "Write reason why..." }}
                />
              </div>
            )}
          </>
        )}
        {sectionType === "additional" && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Additional Section</h3>
            <input
              name="custom_heading"
              placeholder="Heading"
              className="w-full border p-2 mb-2"
              onChange={handleChange}
            />
            <FroalaEditor
              tag="textarea"
              model={formData.custom_paragraph}
              onModelChange={(val) => setFormData({ ...formData, custom_paragraph: val })}
              config={{ heightMin: 180, placeholderText: "Write custom content..." }}
            />
          </div>
        )}
        {sectionType === "founder" && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Founder Details</h3>
            <label className="block font-medium mb-1">Name</label>
            <input
              name="trainer_name"
              placeholder="Name"
              className="w-full border p-2 mb-2"
              onChange={handleChange}
              required
            />
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              placeholder="Title"
              className="w-full border p-2 mb-2"
              onChange={handleChange}
              required
            />
            <label className="block font-medium mb-1">Quote</label>
            <textarea
              name="quote"
              placeholder="Quote"
              className="w-full border p-2 mb-2"
              onChange={handleChange}
              required
            />
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              placeholder="Bio"
              className="w-full border p-2 mb-2"
              onChange={handleChange}
              required
            />
            <label className="block font-medium mb-1">Founder Image</label>
            <input
              type="file"
              name="image"
              className="w-full border p-2 mb-2"
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddAbout;