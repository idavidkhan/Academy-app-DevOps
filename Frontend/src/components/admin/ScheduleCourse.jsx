import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ScheduleCourse() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); // Safe default: empty array
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    course_id: "",
    start_date: "",
    end_date: "",
    venue: "",
    timing: "",
  });

  // Fetch courses from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => {
        console.log("Courses API response:", res.data);

        // Adjust this depending on your backend response structure:
        // If your backend returns { success: true, data: [...] }, use res.data.data
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        setCourses(data);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/schedules", form);

      alert("Schedule created successfully!");
      navigate("/admin/schedule-course");
      //   setForm({
      //     course_id: "",
      //     start_date: "",
      //     end_date: "",
      //     venue: "",
      //     timing: "",
      //   });
    } catch (err) {
      alert("Failed to create schedule: " + err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Schedule a Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Selector */}
        <div>
          <label className="block mb-1 font-semibold">Select Course</label>
          <select
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">
              {loading ? "Loading courses..." : "-- Select Course --"}
            </option>
            {Array.isArray(courses) && courses.length > 0
              ? courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))
              : !loading && <option disabled>No courses available</option>}
          </select>
        </div>

        {/* Start Date */}
        {/* Start Date with Time */}
        <div>
          <label className="block mb-1 font-semibold">Start Date & Time</label>
          <input
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* End Date with Time */}
        <div>
          <label className="block mb-1 font-semibold">End Date & Time</label>
          <input
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block mb-1 font-semibold">Venue</label>
          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="e.g. Islamabad Campus"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Timing */}
        <div>
          <label className="block mb-1 font-semibold">Timing</label>
          <input
            type="text"
            name="timing"
            value={form.timing}
            onChange={handleChange}
            placeholder="e.g. Mon-Wed, 6PM - 8PM"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700"
        >
          Create Schedule
        </button>
      </form>
    </div>
  );
}

export default ScheduleCourse;
