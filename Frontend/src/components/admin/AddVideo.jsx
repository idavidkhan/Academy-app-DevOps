import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddVideo = () => {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail || !videoUrl || !title) {
      alert("Please provide title, thumbnail, and video URL.");
      return;
    }

    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    formData.append("videoUrl", videoUrl);
    formData.append("title", title);

    try {
      await axios.post("http://localhost:5000/api/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video added successfully!");
      navigate("/admin/video-list");
    } catch (err) {
      console.error("Failed to add video", err);
      alert("Failed to add video: " + (err.response?.data?. พร้อมใช้งาน || err.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add Video</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Video Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-full h-64 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Video URL</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/xyz"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddVideo;