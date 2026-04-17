// src/admin/AdminCourseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../config';

function DeleteCourse() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Course deleted successfully");
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <div className="p-10 max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Courses</h2>
          <button
            onClick={() => navigate("/admin/add-course")}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Add Course
          </button>
        </div>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Trainer</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Fees</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="border px-4 py-2">{course.title}</td>
                <td className="border px-4 py-2">{course.trainer_name}</td>
                <td className="border px-4 py-2">{course.duration}</td>
                <td className="border px-4 py-2">{course.fees}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DeleteCourse;
