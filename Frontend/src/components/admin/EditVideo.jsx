import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from '../../config';

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        console.log(`Fetching video with ID: ${id}`); // Debug log
        const res = await axios.get(`${BASE_URL}/api/video/${id}`);
        setVideoUrl(res.data.videoUrl);
        setTitle(res.data.title || "");
        setPreview(`${BASE_URL}/${res.data.thumbnail}`);
      } catch (err) {
        console.error("Error fetching video:", errs);
        alert("Failed to fetch video: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 404) {
          navigate("/admin/video-list");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("videoUrl", videoUrl);
    formData.append("title", title);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      await axios.put(`${BASE_URL}/api/video/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video updated successfully!");
      navigate("/admin/video-list");
    } catch (err) {
      console.error("Error updating video:", err);
      alert("Failed to update video: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Video</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full border p-2 rounded"
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
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
          >
            Update
          </button>
        </form>
      )}
    </div>
  );
};

export default EditVideo;