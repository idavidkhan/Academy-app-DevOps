import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FroalaEditor from "react-froala-wysiwyg";

// Froala CSS & JS
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/themes/gray.min.css";
import { BASE_URL } from '../../config';

function EditFaqs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState({ question: "", answer: "" });

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/faqs`);
        const item = res.data.find((f) => f.id === parseInt(id));
        if (item) setFaq(item);
      } catch (err) {
        console.error("Failed to fetch FAQ:", err);
        alert("Failed to load FAQ data.");
      }
    };

    fetchFaq();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`${BASE_URL}/api/faqs/${id}`, faq, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("FAQ updated successfully!");
      navigate("/admin/faqs");
    } catch (err) {
      console.error("Failed to update FAQ:", err);
      alert("Error updating FAQ.");
    }
  };

  const handleAnswerChange = (content) => {
    setFaq((prev) => ({ ...prev, answer: content }));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit FAQ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Question</label>
          <input
            type="text"
            name="question"
            value={faq.question}
            onChange={(e) => setFaq({ ...faq, question: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Answer</label>
          <FroalaEditor
            tag="textarea"
            model={faq.answer}
            onModelChange={handleAnswerChange}
            config={{
              theme: "gray",
              placeholderText: "Edit the FAQ answer...",
              heightMin: 200,
              charCounterCount: true,
              quickInsertEnabled: true,
              toolbarSticky: false,
              toolbarButtons: {
                moreText: {
                  buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "strikeThrough",
                    "fontFamily",
                    "fontSize",
                    "textColor",
                    "backgroundColor",
                    "clearFormatting",
                  ],
                },
                moreParagraph: {
                  buttons: [
                    "alignLeft",
                    "alignCenter",
                    "alignRight",
                    "formatOL",
                    "formatUL",
                    "paragraphFormat",
                  ],
                },
                moreRich: {
                  buttons: [
                    "insertLink",
                    "insertImage",
                    "insertVideo",
                    "insertTable",
                    "emoticons",
                  ],
                },
                moreMisc: {
                  buttons: ["undo", "redo", "fullscreen", "html"],
                },
              },
            }}
          />
        </div>

        <button
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          type="submit"
        >
          Update FAQ
        </button>
      </form>
    </div>
  );
}

export default EditFaqs;
