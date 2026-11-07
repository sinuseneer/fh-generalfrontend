// src/pages/User/BlogDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlogDetail from "./BlogDetail.jsx";
import api_uri from "../../config/api";
import { getImageUrl } from "../../utils/imageUrl";
import SEO from "../../components/SEO/SEO";

/**
 * Convert timestamp → "DEC 24 2024"
 */
const formatDate = (ts) => {
  if (!ts) return "";
  const date = new Date(ts);

  if (isNaN(date.getTime())) return "";

  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Scroll to top when blog ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${api_uri}posts/${id}`);
      const data = res.data || {};

      // Fix image URL (if not full URL)
      const fixedImage = getImageUrl(data.image);

      // Format date using createdAt (from Mongoose)
      const formatted = formatDate(data.createdAt);

      const finalBlog = {
        ...data,
        image: fixedImage,
        date: formatted,
      };

      setBlog(finalBlog);
    } catch (error) {
      console.error("❌ Error fetching blog:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

   if (loading) return <p style={{ textAlign: "center", padding: 50 }}>Loading…</p>;
  if (!blog) return <p style={{ textAlign: "center", padding: 50 }}>Blog not found.</p>;

  return (
    <>
      {/* ✅ SEO FOR BLOG DETAIL PAGE */}
      <SEO
        title={blog.title}
        description={
          blog.shortDescription ||
          `Read ${blog.title} – medical and industrial equipment insights by FH General Equipment.`
        }
        canonical={`https://fhgeneralequipments.com/blog/${id}`}
        ogImage={
          blog.image ||
          "https://fhgeneralequipments.com/images/no-image.jpg"
        }
      />

      <BlogDetail blog={blog} />
    </>
  );
}
