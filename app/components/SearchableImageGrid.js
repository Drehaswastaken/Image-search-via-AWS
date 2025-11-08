// app/components/SearchableImageGrid.js
"use client";

import { useState } from "react";

export default function SearchableImageGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setImages([]);

    try {
      const res = await fetch(`/api/search?query=${searchTerm}`);
      const imageUrls = await res.json();

      if (res.ok) {
        setImages(imageUrls);
      } else {
        alert("Search failed: " + imageUrls.error);
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("An error occurred during the search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="form-section">
        {" "}
        {/* Use new class for layout */}
        <input
          type="text"
          placeholder="Search for 'beach', 'dog'..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="image-grid">
        {loading && <p>Loading images...</p>}
        {!loading && images.length > 0
          ? images.map((url, index) => (
              <div key={index} className="image-item">
                <img src={url} alt={`Search result ${index + 1}`} />
              </div>
            ))
          : !loading && <p>No images found. Try searching for a tag!</p>}
      </div>
    </div>
  );
}
