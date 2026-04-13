import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    axios
      .get("http://localhost:5000/api/contact-form")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch messages:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      axios
        .delete(`http://localhost:5000/api/contact-form/${id}`)
        .then(() => {
          setMessages((prev) => prev.filter((msg) => msg.id !== id));
        })
        .catch((err) => console.error("Failed to delete message:", err));
    }
  };

  const handleView = (msg) => {
    navigate(`/admin/message/${msg.id}`, { state: msg });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 text-sm text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <tr key={msg.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{msg.name}</td>
                  <td className="px-4 py-2">{msg.email}</td>
                  <td className="px-4 py-2">{msg.phone}</td>
                  <td className="px-4 py-2">
                    {msg.subject?.length > 60
                      ? msg.subject.slice(0, 60) + "..."
                      : msg.subject}
                  </td>
                  <td className="px-4 py-2">
                    {msg.message?.length > 60
                      ? msg.message.slice(0, 60) + "..."
                      : msg.message}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleView(msg)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 text-center" colSpan="8">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Messages;
