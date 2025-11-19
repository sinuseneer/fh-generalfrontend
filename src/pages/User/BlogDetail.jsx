import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Blogdet.css";
import axios from "axios";
import { base_uri, api_uri } from "../../config/api";

export default function BlogDetail() {
  const { id } = useParams(); // get blog ID from URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${api_uri}posts/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.log("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div className="loading">Loading...</div>;

  const pageUrl = window.location.href;

  return (
    <div className="blog-detail-layout">
      {/* SOCIAL ICONS */}
      <div className="social-column">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} target="_blank">
          <i className="bi bi-facebook"></i>
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${pageUrl}`} target="_blank">
          <i className="bi bi-twitter-x"></i>
        </a>
        <a href="https://youtube.com" target="_blank">
          <i className="bi bi-youtube"></i>
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`} target="_blank">
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="https://instagram.com" target="_blank">
          <i className="bi bi-instagram"></i>
        </a>
      </div>

      {/* MAIN CONTENT */}
      <div className="blog-detail-wrapper">
        <div className="blog-hero-section">
          <img
            src={`${base_uri}${blog.image}`}
            alt={blog.title}
            className="blog-hero-img"
          />
        </div>

        <div className="blog-meta">
          <span className="blog-date">{blog.date}</span>
          <span className="dot-separator">•</span>
          <span className="blog-author">Post by Admin</span>
        </div>

        <h1 className="blog-title">{blog.title}</h1>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.longDescription }}
        />
      </div>
    </div>
  );
}
