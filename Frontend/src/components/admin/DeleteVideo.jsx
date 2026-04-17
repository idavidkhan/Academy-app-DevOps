import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AddVideo from "./AddVideo";
import { BASE_URL } from '../../config';

const DeleteVideo = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/video/all`);
      console.log("Fetched videos:", res.data); // Debug log
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert(
        "Failed to fetch videos: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/video/${id}`);
      setVideos([]);
      alert("Video deleted successfully!");
      navigate("/admin/video"); // Navigate to AddVideo form after deletion
    } catch (err) {
      console.error("Delete failed:", err);
      alert(
        "Failed to delete video: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // If no videos, show AddVideo form
  if (videos.length === 0) {
    return <AddVideo />;
  }

  // Show only the first video's details
  const video = videos[0];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Video Details</h2>
      </div>
      <div className="bg-white shadow-md p-6 rounded-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Title</h3>
          <p>{video.title || "No Title"}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Thumbnail</h3>
          <img
            src={`${BASE_URL}/${video.thumbnail}`}
            alt="thumbnail"
            className="w-64 h-40 object-cover rounded"
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Video URL</h3>
          <p className="break-all">{video.videoUrl}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/admin/edit-video/${video.id}`}
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
            onClick={() => console.log(`Navigating to edit video ID: ${video.id}`)}
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(video.id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVideo;