// src/components/blog/BlogDetail.jsx
import React from "react";
import "./Blogdet.css";
import api_uri, { base_uri } from "../../config/api";
// If you want to sanitize HTML, uncomment the next line and install dompurify:
// import DOMPurify from "dompurify";

export default function BlogDetail({ blog }) {
  if (!blog) return null;

  // Current page URL (encoded for share links)
  const pageUrl = encodeURIComponent(window.location.href);

  // Convert plain text → HTML with paragraphs + line breaks
  const formatContent = (text) => {
    if (!text) return "";
    return text
      .split("\n\n")
      .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  };

  // If server returns a full URL (starts with http) use it; otherwise prefix base_uri
  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${base_uri}${img}`;
  };

  // prepare HTML (sanitization recommended)
  let html = formatContent(blog.longDescription || "");
  // If you install dompurify:
  // html = DOMPurify.sanitize(html);

  return (
    <div className="blog-detail-layout">
      {/* SOCIAL ICONS */}
      <div className="social-column">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <i className="bi bi-facebook"></i>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${pageUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <i className="bi bi-twitter"></i>
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <i className="bi bi-youtube"></i>
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <i className="bi bi-linkedin"></i>
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <i className="bi bi-instagram"></i>
        </a>
      </div>

      {/* RIGHT CONTENT */}
      <div className="blog-detail-wrapper">
        {/* HERO IMAGE */}
        <div className="blog-hero-section">
          <img
            src={getImageUrl(blog.image)}
            className="blog-hero-img"
            alt={blog.title || "blog image"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-image.png"; // optional fallback
            }}
          />
        </div>

        {/* META */}
        <div className="blog-meta">
          <span>{blog.date}</span>
          <span className="dot-separator"> • </span>
          <span>Post by {blog.author || "Admin"}</span>
        </div>

        {/* TITLE */}
        <h1 className="blog-title">{blog.title}</h1>

        {/* CONTENT */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
