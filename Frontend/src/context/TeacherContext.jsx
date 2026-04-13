// context/TeacherContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teachers");
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <TeacherContext.Provider value={{ teachers, setTeachers }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacherContext = () => useContext(TeacherContext);
