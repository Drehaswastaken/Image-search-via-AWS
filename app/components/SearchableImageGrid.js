// app/components/SearchableImageGrid.js
"use client";
import { useState, useEffect } from "react"; // Import useEffect

export default function SearchableImageGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  // The 'images' state now holds the full objects: [{url, tags}, ...]
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch all gallery images
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const galleryImages = await res.json();
      if (res.ok) {
        setImages(galleryImages);
      } else {
        alert("Error fetching gallery: " + galleryImages.error);
      }
    } catch (error) {
      console.error("Gallery fetch failed:", error);
      alert("An error occurred while fetching the gallery.");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Use useEffect to load the gallery on first render
  useEffect(() => {
    fetchGallery();
  }, []); // The empty array [] means this runs only once on mount

  // This function is now just for searching
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      fetchGallery(); // If search is empty, reload the full gallery
      return;
    }

    setLoading(true);
    setImages([]);

    try {
      const res = await fetch(`/api/search?query=${searchTerm}`);
      // The API now returns [{url, tags}, ...]
      const searchResults = await res.json();

      if (res.ok) {
        setImages(searchResults);
      } else {
        alert("Search failed: " + searchResults.error);
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
          ? // We now map over 'image' objects, not just URLs
            images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.url} alt={`Search result ${index + 1}`} />

                {/* This is the new hover overlay */}
                <div className="image-overlay">
                  <p>Detected Tags:</p>
                  <div className="tags-container">
                    {image.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          : !loading && <p>No images found. Try uploading some!</p>}
      </div>
    </div>
  );
}
