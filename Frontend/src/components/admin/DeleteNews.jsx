import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function DeleteNews() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/news");
      console.log("Fetched news in NewsList:", response.data); // Debug
      setNews(response.data);
      setError(null);
    } catch (err) {
      console.error("Load failed:", err.response?.data || err.message);
      setError(
        "Failed to load news: " + (err.response?.data?.details || err.message)
      );
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      fetchNews();
      alert("News deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert(
        "Error deleting news: " + (err.response?.data?.details || err.message)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All News</h2>
        <Link
          to="/admin/add-news"
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
        >
          + Add News
        </Link>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200 shadow rounded">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Written By</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm bg-white">
            {news.map((item) => (
              <tr key={item.id}>
                <td className="p-3">
                  {item.image ? (
                    <>
                      <img
                        src={`http://localhost:5000/uploads/news/${item.image}`}
                        alt={item.title}
                        className="w-20 h-14 object-cover rounded"
                        onError={(e) => {
                          console.error(`Image failed to load: ${item.image}`);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "inline";
                        }}
                      />
                      <span style={{ display: "none" }}>No Image</span>
                    </>
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="p-3 font-medium text-gray-800">{item.title}</td>
                <td className="p-3 text-gray-600">{item.author}</td>
                <td className="p-3 text-gray-600">{item.category}</td>
                <td className="p-3 text-gray-600">{item.duration}</td>
                <td className="p-3 text-gray-600">{item.written_by}</td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/edit-news/${item.id}`}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {news.length === 0 && !error && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No news entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeleteNews;
