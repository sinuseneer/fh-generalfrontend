// src/pages/blog/BlogDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlogDetail from "../../components/blog/BlogDetail";
import api_uri from "../../config/api";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api_uri}posts/${id}`);
      // Expect the API to return the blog object with .image being either
      // a path (e.g. "/uploads/abc.jpg") or a full URL.
      setBlog(res.data);
    } catch (error) {
      console.error("❌ Error fetching blog:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    // if you want to re-fetch when id changes, the dependency already includes id via route
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center", padding: 50 }}>Loading...</p>;
  }

  if (!blog) {
    return <p style={{ textAlign: "center", padding: 50 }}>Blog not found.</p>;
  }

  return <BlogDetail blog={blog} />;
}
