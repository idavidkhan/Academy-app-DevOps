import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../config';

function DeleteTeacher() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  // Utility function to strip HTML from Froala content
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/teachers`);
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this teacher?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Teacher deleted successfully");
      fetchTeachers(); // Refresh the list
    } catch (err) {
      alert("Failed to delete teacher");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Teachers</h2>
        <button
          onClick={() => navigate("/admin/add-teacher")}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Add Teacher
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Designation</th>
            <th className="border px-4 py-2">Bio</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="border px-4 py-2">{teacher.name}</td>
              <td className="border px-4 py-2">{teacher.designation}</td>
              <td className="border px-4 py-2 line-clamp-2">
                {stripHtml(teacher.bio).length > 100
                  ? stripHtml(teacher.bio).slice(0, 100) + "..."
                  : stripHtml(teacher.bio)}
              </td>
              <td className="border px-4 py-2 align-middle">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-teacher/${teacher.id}`)
                    }
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeleteTeacher;
