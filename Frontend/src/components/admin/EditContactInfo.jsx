import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditContactInfo = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    phone: "",
    email: "",
    support_email: "",
    office_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    country: "",
    working_days: "",
    weekend: "",
    map_location: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    github: "",
  });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact-info");
      if (res.data) {
        setInfo({
          phone: res.data.phone || "",
          email: res.data.email || "",
          support_email: res.data.support_email || "",
          office_name: res.data.office_name || "",
          address_line1: res.data.address_line1 || "",
          address_line2: res.data.address_line2 || "",
          city: res.data.city || "",
          country: res.data.country || "",
          working_days: res.data.working_days || "",
          weekend: res.data.weekend || "",
          map_location: res.data.map_location || "",
          facebook: res.data.facebook || "",
          linkedin: res.data.linkedin || "",
          twitter: res.data.twitter || "",
          github: res.data.github || "",
        });
        setId(res.data.id);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch contact info:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/contact-info/${id}`, info);
        alert("Contact Info Updated");
      } else {
        await axios.post("http://localhost:5000/api/contact-info", info);
        alert("Contact Info Added");
      }
      navigate("/admin/contact");
    } catch (err) {
      console.error("Save failed:", err.response?.data || err);
      alert("Failed to save contact info");
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Edit Contact Information</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { label: "Phone", name: "phone" },
            { label: "Email", name: "email", type: "email" },
            { label: "Support Email", name: "support_email", type: "email" },
            { label: "Office Name", name: "office_name" },
            { label: "Address Line 1", name: "address_line1" },
            { label: "Address Line 2", name: "address_line2" },
            { label: "City", name: "city" },
            { label: "Country", name: "country" },
            { label: "Working Days", name: "working_days" },
            { label: "Weekend", name: "weekend" },
            { label: "Facebook", name: "facebook" },
            { label: "LinkedIn", name: "linkedin" },
            { label: "Twitter", name: "twitter" },
            { label: "GitHub", name: "github" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label htmlFor={name} className="block mb-1 font-medium">
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={info[name]}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label htmlFor="map_location" className="block mb-1 font-medium">
              Map Location
            </label>
            <input
              type="text"
              name="map_location"
              id="map_location"
              placeholder="e.g. G-10 Islamabad or full embed URL"
              value={info.map_location}
              onChange={handleChange}
              className="p-3 border rounded w-full"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded w-full"
            >
              {id ? "Update Info" : "Add Info"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditContactInfo;