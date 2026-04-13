// src/components/admin/EditSchedule.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_id: "",
    start_date: "",
    end_date: "",
    venue: "",
    timing: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses").then((res) => {
      setCourses(res.data);
    });

    axios.get(`http://localhost:5000/api/schedules/${id}`).then((res) => {
      const schedule = res.data;
      setForm({
        course_id: schedule.course_id,
        start_date: formatLocalDateTime(schedule.start_date),
        end_date: formatLocalDateTime(schedule.end_date),

        venue: schedule.venue,
        timing: schedule.timing,
      });
    });

    function formatLocalDateTime(dateString) {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60000);
      return localDate.toISOString().slice(0, 16);
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/schedules/${id}`, form);
      alert("Schedule updated successfully!");
      navigate("/admin/schedule-course");
    } catch (err) {
      alert("Failed to update schedule: " + err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Course Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Select Course</label>
          <select
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Start Date & Time</label>
          <input
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">End Date & Time</label>
          <input
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Venue</label>
          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Timing</label>
          <input
            type="text"
            name="timing"
            value={form.timing}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700"
        >
          Update Schedule
        </button>
      </form>
    </div>
  );
}

export default EditSchedule;
