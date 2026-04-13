import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/schedules");
      setSchedules(res.data);
    } catch (err) {
      console.error("Error fetching schedules:", err.message);
      setError("Failed to load schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <ScheduleContext.Provider value={{ schedules, loading, error }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => useContext(ScheduleContext);
