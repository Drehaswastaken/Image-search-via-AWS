// app/components/Uploader.js
"use client";

import { useState } from "react";

export default function Uploader() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUploadClick = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);

    try {
      const res = await fetch("/api/generate-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      const { uploadUrl, key } = await res.json();

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const processRes = await fetch("/api/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const { tags } = await processRes.json();
      alert(`File uploaded and processed! Detected tags: ${tags.join(", ")}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
      setFile(null);
      document.getElementById("file-input").value = null;
    }
  };

  return (
    <div className="form-section">
      {" "}
      {/* Use new class for layout */}
      <input
        id="file-input"
        type="file"
        accept="image/png, image/jpeg"
        onChange={onFileChange}
      />
      <button onClick={onUploadClick} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
