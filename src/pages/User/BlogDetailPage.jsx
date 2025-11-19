import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlogDetail from "./BlogDetail";
import api_uri, { base_uri } from "../../config/api";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${api_uri}posts/${id}`);

      // Ensure correct image URL
      const blogData = {
        ...res.data,
        image: `${base_uri}${res.data.image}`
      };

      setBlog(blogData);
    } catch (error) {
      console.error("❌ Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center", padding: 50 }}>Loading...</p>;
  }

  if (!blog) {
    return <p style={{ textAlign: "center", padding: 50 }}>Blog not found.</p>;
  }

  return <BlogDetail blog={blog} />;
}
