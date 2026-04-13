import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/news");
      setAllNews(res.data);
      setLoading(false);
    } catch (err) {
      console.error(
        "Failed to fetch news:",
        err.response?.data || err.message
      );
      setError("Failed to load news. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const subscribe = async (email) => {
    try {
      await axios.post("http://localhost:5000/api/subscribers", { email });
    } catch (err) {
      throw err;
    }
  };

  const popularNews = allNews.slice(0, 5);
  const categories = [...new Set(allNews.map((n) => n.category))].filter(Boolean);

  return (
    <NewsContext.Provider
      value={{
        selectedNews,
        setSelectedNews,
        allNews,
        setAllNews,
        loading,
        error,
        subscribe,
        popularNews,
        categories,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = () => useContext(NewsContext);
