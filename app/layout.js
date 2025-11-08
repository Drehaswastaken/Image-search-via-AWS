// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google"; // Import Inter font

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font

export const metadata = {
  title: "Image Search App",
  description: "Upload and search images with AI tags",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts link for Inter. Next.js handles this better with next/font */}
        {/* We initialized it above, so it will be applied via className={inter.className} */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
