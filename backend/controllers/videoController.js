const db = require("../models/db");
const fs = require("fs");
const path = require("path");

exports.getVideo = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT * FROM video ORDER BY id DESC LIMIT 1"
    );
    if (!data.length) {
      return res.status(404).json({ message: "No video found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching latest video:", err);
    res
      .status(500)
      .json({ message: "Error fetching latest video", error: err.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching video with ID: ${id}`); // Debug log
    const [data] = await db.query("SELECT * FROM video WHERE id = ?", [id]);
    if (!data.length) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching video by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching video", error: err.message });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const [videos] = await db.query("SELECT * FROM video");
    res.json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res
      .status(500)
      .json({ message: "Error fetching videos", error: err.message });
  }
};

exports.addVideo = async (req, res) => {
  try {
    const { title, videoUrl } = req.body;
    const thumbnail = req.file
      ? path.join("Uploads/videos", req.file.filename).replace(/\\/g, "/")
      : null;
    await db.query(
      "INSERT INTO video (title, thumbnail, videoUrl) VALUES (?, ?, ?)",
      [title || null, thumbnail, videoUrl]
    );
    res.json({ message: "Video added successfully" });
  } catch (err) {
    console.error("Error adding video:", err);
    res.status(500).json({ message: "Error adding video", error: err.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, videoUrl } = req.body;
    const thumbnail = req.file
      ? path.join("Uploads/videos", req.file.filename).replace(/\\/g, "/")
      : null;

    const [oldData] = await db.query("SELECT * FROM video WHERE id = ?", [id]);
    if (!oldData.length) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (
      thumbnail &&
      oldData[0].thumbnail &&
      fs.existsSync(path.join(__dirname, "..", oldData[0].thumbnail))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", oldData[0].thumbnail));
    }

    await db.query(
      "UPDATE video SET title = ?, videoUrl = ?, thumbnail = ? WHERE id = ?",
      [title || null, videoUrl, thumbnail || oldData[0].thumbnail, id]
    );
    res.json({ message: "Video updated successfully" });
  } catch (err) {
    console.error("Error updating video:", err);
    res
      .status(500)
      .json({ message: "Error updating video", error: err.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [oldData] = await db.query("SELECT * FROM video WHERE id = ?", [id]);
    if (!oldData.length) {
      return res.status(404).json({ message: "Video not found" });
    }
    if (
      oldData[0].thumbnail &&
      fs.existsSync(path.join(__dirname, "..", oldData[0].thumbnail))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", oldData[0].thumbnail));
    }
    await db.query("DELETE FROM video WHERE id = ?", [id]);
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Error deleting video:", err);
    res
      .status(500)
      .json({ message: "Error deleting video", error: err.message });
  }
};
