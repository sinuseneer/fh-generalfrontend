import React from "react";
import "./Blogdet.css";

const BlogDetail = ({ blog }) => {
  return (
    <div className="blog-detail-wrapper">

      {/* HERO IMAGE */}
      <div className="blog-hero-section">
        <img
          src={blog.image}
          alt={blog.title}
          className="blog-hero-img"
        />
      </div>

      {/* BLOG META */}
      <div className="blog-meta">
        <span className="blog-date">{blog.date}</span>
        <span className="dot-separator">•</span>
        <span className="blog-author">Post by {blog.author}</span>
      </div>

      {/* BLOG TITLE */}
      <h1 className="blog-title">{blog.title}</h1>

      {/* BLOG CONTENT */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* RELATED POSTS */}
      {blog.related && blog.related.length > 0 && (
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
  );
};

export default BlogDetail;
