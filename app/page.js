// app/page.js
import Uploader from "./components/Uploader";
import SearchableImageGrid from "./components/SearchableImageGrid";

export default function Home() {
  return (
    // Use a wrapper div to hold both the container and the footer
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* This is your main content, push it to take up available space */}
      <main className="container" style={{ flexGrow: 1 }}>
        <h1>Pictura.Ai</h1>
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

        <hr />

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
      </main>

      {/* --- This is your new footer --- */}
      <footer className="site-footer">Made with ❤︎ Darahaas</footer>
      {/* --- End of new footer --- */}
    </div>
  );
}
