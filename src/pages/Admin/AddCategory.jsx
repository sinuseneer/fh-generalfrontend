import React, { useState } from "react";
import axios from "axios";
import api_uri from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !image) {
      toast.warning("⚠️ Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", categoryName);
    formData.append("image", image);

    try {
      const res = await axios.post(`${api_uri}category/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("✅ Category added successfully!");
        // Navigate to category list after a short delay
        setTimeout(() => {
          navigate("/admin/categories/list");
        }, 1500);
      } else {
        toast.error(res.data.message || "Failed to add category");
      }

      setCategoryName("");
      setImage(null);
    } catch (error) {
      console.error("❌ Error adding category:", error);
      toast.error("Server error while adding category!");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card bg-dark text-light shadow-lg rounded-4 p-4">
        <h3 className="fw-bold text-uppercase mb-4 text-center">Add New Category</h3>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Category Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Category Name *</label>
            <input
              type="text"
              className="form-control bg-secondary bg-opacity-25 text-light border-secondary"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Upload Image *</label>
            <input
              type="file"
              className="form-control bg-secondary bg-opacity-25 text-light border-secondary"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
