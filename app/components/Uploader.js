// app/components/Uploader.js
"use client";
import { useState } from "react";

export default function Uploader() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onUploadClick = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);

    try {
      // 1. Get a pre-signed URL
      const res = await fetch("/api/generate-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      const { uploadUrl, key } = await res.json();

      // 2. Upload the file directly to S3
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // 3. Notify our backend to process the image
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
      // Reset the hidden file input
      document.getElementById("file-input").value = null;
    }
  };

  return (
    <div className="form-section">
      {/* 1. The original input is now hidden */}
      <input
        id="file-input"
        type="file"
        accept="image/png, image/jpeg"
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      {/* 2. This is the new, styled button label */}
      <label htmlFor="file-input" className="file-upload-btn">
        Choose File
      </label>

      {/* 3. This span displays the selected file name */}
      <span className="file-name-display">
        {file ? file.name : "No file chosen"}
      </span>

      {/* 4. The upload button is disabled if no file is selected */}
      <button
        onClick={onUploadClick}
        disabled={uploading || !file}
        className="upload-btn"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
