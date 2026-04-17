import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from '../config';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/api/video`);
      console.log("Fetched video data:", res.data); // Debug log
      setVideoData(res.data);
    } catch (error) {
      console.error("Error fetching video data:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  return (
    <VideoContext.Provider value={{ videoData, loading, error }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);
