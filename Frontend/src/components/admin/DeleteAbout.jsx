import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const DeleteAbout = () => {
  const [aboutData, setAboutData] = useState([]);

  const fetchAboutData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/about");
      setAboutData(res.data);
    } catch (err) {
      console.error("Error fetching about data:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try {
        await axios.delete(`http://localhost:5000/api/about/${id}`);
        fetchAboutData();
      } catch (err) {
        console.error("Error deleting entry:", err);
      }
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const sectionMap = {
    main: "Mission, Vision & Why TRESCOL",
    additional: "Additional Sections",
    founder: "Founders",
  };

  const groupedData = aboutData.reduce((acc, item) => {
    const sectionType = ["mission", "vision", "why"].includes(item.section)
      ? "main"
      : item.section === "custom"
      ? "additional"
      : "founder";
    acc[sectionType] = acc[sectionType] || [];
    acc[sectionType].push(item);
    return acc;
  }, {});

  const renderTable = (type) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{sectionMap[type]}</h2>
        <Link
          to={`/admin/add-about?section_type=${type}`}
          className="flex items-center gap-1 bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
        >
          <FaPlus /> Add
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-teal-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Content</th>
              {type === "founder" && <th className="py-2 px-4 text-left">Image</th>}
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedData[type]?.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 px-4">
                  {item.section === "founder" ? item.trainer_name : item.card_heading || "-"}
                </td>
                <td className="py-2 px-4">
                  <div
                    className="text-sm text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: item.section === "founder" ? item.bio : item.card_paragraph,
                    }}
                  />
                </td>
                {type === "founder" && (
                  <td className="py-2 px-4">
                    {item.image && (
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt="img"
                        className="h-12 object-cover rounded"
                      />
                    )}
                  </td>
                )}
                <td className="py-2 px-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <Link
                      to={`/admin/edit-about/${item.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-900 mb-8">Manage About Section</h1>
      {renderTable("main")}
      {renderTable("additional")}
      {renderTable("founder")}
    </div>
  );
};

export default DeleteAbout;