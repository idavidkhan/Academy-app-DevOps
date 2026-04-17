import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { BASE_URL } from '../../config';

function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching subscribers from ${BASE_URL}/api/subscribers`);
      const res = await axios.get(`${BASE_URL}/api/subscribers`, {
        headers: { "Cache-Control": "no-cache" },
      });
      console.log("Subscribers response:", res.data);
      if (!Array.isArray(res.data)) {
        console.error("Expected array, received:", res.data);
        setError("Invalid data format received from server.");
        setSubscribers([]);
      } else {
        setSubscribers(res.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch subscribers:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Failed to fetch subscribers. Please try again.");
      toast.error("Failed to fetch subscribers. Please try again.");
      setLoading(false);
      setSubscribers([]);
    }
  }, []);

  const deleteSubscriber = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/subscribers/${id}`);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subscriber deleted successfully");
    } catch (err) {
      console.error("Failed to delete subscriber:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("Failed to delete subscriber. Please try again.");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers, location.pathname]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📬 Subscribers</h2>
        <button
          onClick={fetchSubscribers}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading subscribers...</p>
      ) : subscribers.length === 0 ? (
        <p className="text-gray-600">No subscribers found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">Subscribed At</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {subscribers.map((sub, index) => (
                <tr key={sub.id}>
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{sub.email}</td>
                  <td className="px-6 py-3">
                    {new Date(sub.subscribed_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => deleteSubscriber(sub.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Subscribers;