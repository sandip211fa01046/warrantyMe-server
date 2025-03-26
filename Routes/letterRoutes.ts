import React, { useState, useEffect } from "react";
import axios from "axios";
import { RichTextEditor } from "@mantine/rte";
import "@mantine/rte/style.css"; // Import the Mantine RTE styles

const API_BASE_URL = "https://warranty-me-server.vercel.app"; // Backend URL

const LetterEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [drafts, setDrafts] = useState<{ title: string; content: string }[]>([]);

  useEffect(() => {
    const savedDrafts = localStorage.getItem("letterDrafts");
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  const saveDraft = () => {
    const newDrafts = [...drafts, { title, content }];
    setDrafts(newDrafts);
    localStorage.setItem("letterDrafts", JSON.stringify(newDrafts));
    alert("Draft saved!");
  };

  const createLetter = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/letter/create`, {
        title,
        content,
        userId: "123", // Replace with actual user ID
      });
      console.log(response.data);
      alert("Letter saved!");
    } catch (error) {
      console.error("Error saving letter:", error);
    }
  };

  const uploadToDrive = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/letter/upload`, {
        title,
        content,
      });
      console.log(response.data);
      alert("Uploaded to Google Drive!");
    } catch (error) {
      console.error("Error uploading letter:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Letter Editor</h1>
      <input
        type="text"
        placeholder="Letter Title"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <RichTextEditor
        value={content}
        onChange={setContent}
        className="mb-4"
        placeholder="Write your letter here..."
      />
      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={saveDraft}
        >
          Save Draft
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={createLetter}
        >
          Save Letter
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={uploadToDrive}
        >
          Upload to Drive
        </button>
      </div>

      {drafts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Drafts</h2>
          {drafts.map((draft, index) => (
            <div
              key={index}
              className="p-3 border rounded my-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setTitle(draft.title);
                setContent(draft.content);
              }}
            >
              {draft.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LetterEditor;
