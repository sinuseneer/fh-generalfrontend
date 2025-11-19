import React from "react";
import "./Blogdet.css";
import { base_uri } from "../../config/api";

export default function BlogDetail({ blog }) {
  if (!blog) return null;

  const pageUrl = window.location.href;

  // Convert plain text → HTML with paragraphs + line breaks
  const formatContent = (text) => {
    return text
      .split("\n\n")
      .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  };

  return (
    <div className="blog-detail-layout">

      {/* SOCIAL ICONS */}
      <div className="social-column">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} target="_blank"><i className="bi bi-facebook"></i></a>
        <a href={`https://twitter.com/intent/tweet?url=${pageUrl}`} target="_blank"><i className="bi bi-twitter-x"></i></a>
        <a href="https://youtube.com" target="_blank"><i className="bi bi-youtube"></i></a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`} target="_blank"><i className="bi bi-linkedin"></i></a>
        <a href="https://instagram.com" target="_blank"><i className="bi bi-instagram"></i></a>
      </div>

      {/* RIGHT CONTENT */}
      <div className="blog-detail-wrapper">

        {/* HERO IMAGE */}
        <div className="blog-hero-section">
          <img src={`${base_uri}${blog.image}`} className="blog-hero-img" alt={blog.title} />
        </div>

        {/* META */}
        <div className="blog-meta">
          <span>{blog.date}</span>
          <span className="dot-separator"> • </span>
          <span>Post by Admin</span>
        </div>

        {/* TITLE */}
        <h1 className="blog-title">{blog.title}</h1>

        {/* CONTENT */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: formatContent(blog.longDescription) }}
        />
      </div>
    </div>
  );
}
