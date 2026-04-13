import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function DeleteSchedule() {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  const fetchSchedules = () => {
    axios.get("http://localhost:5000/api/schedules").then((res) => {
      setSchedules(res.data);
    });
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
      alert("Schedule deleted!");
      fetchSchedules();
    } catch (err) {
      alert("Failed to delete schedule.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Scheduled Courses</h2>
        <button
          onClick={() => navigate("/admin/add-schedule")}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          + Add Schedule
        </button>
      </div>

      {schedules.length === 0 ? (
        <p>No schedules found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Course Title</th>
              <th className="border px-2 py-1">Start</th>
              <th className="border px-2 py-1">End</th>
              <th className="border px-2 py-1">Venue</th>
              <th className="border px-2 py-1">Timing</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.title || s.course_id}</td>
                <td className="border px-2 py-1">
                  {new Date(s.start_date).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    hour12: true,
                    timeZone: "Asia/Karachi",
                  })}
                </td>
                <td className="border px-2 py-1">
                  {new Date(s.end_date).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    hour12: true,
                    timeZone: "Asia/Karachi",
                  })}
                </td>

                <td className="border px-2 py-1">{s.venue}</td>
                <td className="border px-2 py-1">{s.timing}</td>
                <td className="border px-2 py-1 space-x-2">
                  <Link
                    to={`/admin/edit-schedule/${s.id}`}
                    className="bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DeleteSchedule;
