// src/context/AboutContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from '../config';

const AboutContext = createContext();

export function AboutProvider({ children }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from backend
  const fetchAboutData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/about`);
      setPeople(res.data);
    } catch (err) {
      console.error("Failed to fetch about data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  return (
    <AboutContext.Provider value={{ people, setPeople, loading }}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAboutContext() {
  return useContext(AboutContext);
}
