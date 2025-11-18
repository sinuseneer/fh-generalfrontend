import React from "react";
import "./Blogdet.css";

const BlogDetail = ({ blog }) => {
  if (!blog) return null;

  const pageUrl = window.location.href;

  return (
    <div className="blog-detail-layout">

      {/* LEFT COLUMN – SOCIAL ICONS */}
      <div className="social-column">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-facebook"></i>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${pageUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-twitter-x"></i>
        </a>

        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-youtube"></i>
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-linkedin"></i>
        </a>

        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-instagram"></i>
        </a>
      </div>

      {/* RIGHT COLUMN – YOUR ORIGINAL DESIGN */}
      <div className="blog-detail-wrapper">

        {/* HERO IMAGE */}
        <div className="blog-hero-section">
          <img src={blog.image} alt={blog.title} className="blog-hero-img" />
        </div>

        {/* META */}
        <div className="blog-meta">
          <span className="blog-date">{blog.date}</span>
          <span className="dot-separator">•</span>
          <span className="blog-author">
            Post by {blog.author ? blog.author : "Admin"}
          </span>
        </div>

        {/* TITLE */}
        <h1 className="blog-title">{blog.title}</h1>

        {/* CONTENT */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.longDescription }}
        />

        {/* RELATED POSTS */}
        {blog.related?.length > 0 && (
          <div className="related-wrapper">
            <h2 className="related-title">Related Posts</h2>
            <div className="related-grid">
              {blog.related.map((item, i) => (
                <a href={`/blog/${item._id}`} className="related-card" key={i}>
                  <img src={item.image} alt={item.title} />
                  <p className="related-date">{item.date}</p>
                  <h3 className="related-heading">{item.title}</h3>
                  <span className="read-more">Read More →</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetail;
