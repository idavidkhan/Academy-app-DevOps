import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from '../config';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses`); // Make sure this matches your backend route
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ courses, setCourses, loading }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => useContext(CourseContext);
