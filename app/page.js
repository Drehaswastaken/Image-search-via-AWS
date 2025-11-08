// app/page.js
import Uploader from "./components/Uploader";
import SearchableImageGrid from "./components/SearchableImageGrid";

export default function Home() {
  return (
    <div className="container">
      {" "}
      {/* Main container */}
      <h1>Pictura.AI</h1>
      <p>
        Upload your images and let our AI categorize them. Then, effortlessly
        search through your visual library!
      </p>
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          background: "#2a3447",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h2>Upload New Visuals</h2>
        <Uploader />
      </div>
      <hr /> {/* Divider */}
      <div
        style={{
          padding: "1.5rem",
          background: "#2a3447",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h2>Explore & Search</h2>
        <SearchableImageGrid />
      </div>
    </div>
  );
}
