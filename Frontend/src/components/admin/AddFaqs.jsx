import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FroalaEditor from "react-froala-wysiwyg";

// Froala CSS & JS
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/themes/gray.min.css";
import { BASE_URL } from '../../config';

function AddFaqs() {
  const [faq, setFaq] = useState({ question: "", answer: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${BASE_URL}/api/faqs/add`, faq, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("FAQ added successfully!");
      navigate("/admin/faqs");
    } catch (err) {
      console.error("Failed to add FAQ:", err);
      alert("Error adding FAQ.");
    }
  };

  const handleAnswerChange = (content) => {
    setFaq((prev) => ({ ...prev, answer: content }));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add FAQ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question */}
        <div>
          <label className="block mb-1 font-semibold">Question</label>
          <input
            type="text"
            name="question"
            value={faq.question}
            onChange={(e) => setFaq({ ...faq, question: e.target.value })}
            placeholder="Enter question"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Answer with Froala */}
        <div>
          <label className="block mb-1 font-semibold">Answer</label>
          <FroalaEditor
            tag="textarea"
            model={faq.answer}
            onModelChange={handleAnswerChange}
            config={{
              theme: "gray",
              placeholderText: "Write FAQ answer here...",
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
                    "subscript",
                    "superscript",
                    "fontFamily",
                    "fontSize",
                    "textColor",
                    "backgroundColor",
                    "inlineClass",
                    "inlineStyle",
                    "clearFormatting",
                  ],
                  buttonsVisible: 5,
                },
                moreParagraph: {
                  buttons: [
                    "alignLeft",
                    "alignCenter",
                    "formatOL",
                    "formatUL",
                    "paragraphFormat",
                    "paragraphStyle",
                    "lineHeight",
                    "outdent",
                    "indent",
                    "quote",
                  ],
                  buttonsVisible: 5,
                },
                moreRich: {
                  buttons: [
                    "insertLink",
                    "insertImage",
                    "insertVideo",
                    "insertTable",
                    "emoticons",
                    "fontAwesome",
                    "specialCharacters",
                    "embedly",
                    "insertHR",
                  ],
                  buttonsVisible: 4,
                },
                moreMisc: {
                  buttons: [
                    "undo",
                    "redo",
                    "fullscreen",
                    "print",
                    "getPDF",
                    "html",
                  ],
                  align: "right",
                  buttonsVisible: 4,
                },
              },
            }}
          />
        </div>

        <button
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          type="submit"
        >
          Add FAQ
        </button>
      </form>
    </div>
  );
}

export default AddFaqs;
