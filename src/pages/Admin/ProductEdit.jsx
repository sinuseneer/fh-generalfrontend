import React, { useEffect, useState } from "react";
import axios from "axios";
import api_uri, { base_uri } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Form, Button, Card, Row, Col, Image } from "react-bootstrap";
import { FaSave, FaUpload } from "react-icons/fa";

function ProductEdit() {
  const { id } = useParams(); // product ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prod_id: "",
    product_name: "",
    CAT_ID: "",
    description: "",
    product_info: "",
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // ✅ Load product details + categories
  useEffect(() => {
    loadCategories();
    loadProduct();
  }, [id]);

  const loadCategories = async () => {
    try {
  const res = await axios.post(`${api_uri}category/view`);
      if (res.data.success) setCategories(res.data.categories);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const loadProduct = async () => {
    try {
  const res = await axios.get(`${api_uri}product/${id}`);
      if (res.data.success) {
        const product = res.data.product;
        setFormData({
          prod_id: product.prod_id,
          product_name: product.product_name,
          CAT_ID: product.CAT_ID?._id || "",
          description: product.description,
          product_info: product.product_info || "",
        });

        if (product.images?.length > 0) {
          setPreviewUrls(product.images.map((img) => `${base_uri}${img.image_path}`));
        }
      }
    } catch {
      toast.error("Failed to fetch product");
    }
  };

  // ✅ Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image selection (new uploads)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Update text details
      const res = await axios.put(`${api_uri}product/update/${id}`, formData);

      if (res.data.success) {
        // 2️⃣ Upload images (optional)
        if (images.length > 0) {
          const imgForm = new FormData();
          images.forEach((file) => imgForm.append("images", file));
          await axios.post(
            `${api_uri}product/upload-images/${id}`,
            imgForm,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        toast.success("✅ Product updated successfully!");
        setTimeout(() => navigate("/admin/products/list"), 1500);
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
      toast.error("Server error while updating");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "900px" }}>
      <Card className="bg-dark text-light p-4 shadow-lg rounded-4">
        <h3 className="fw-bold text-uppercase mb-4 text-center text-info">
          Edit Product
        </h3>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Product ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="prod_id"
                  value={formData.prod_id}
                  onChange={handleChange}
                  required
                  className="bg-secondary bg-opacity-25 text-light border-secondary"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                  className="bg-secondary bg-opacity-25 text-light border-secondary"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Category *</Form.Label>
            <Form.Select
              name="CAT_ID"
              value={formData.CAT_ID}
              onChange={handleChange}
              required
              className="bg-secondary bg-opacity-25 text-light border-secondary"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-secondary bg-opacity-25 text-light border-secondary"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Additional Info</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="product_info"
              value={formData.product_info}
              onChange={handleChange}
              className="bg-secondary bg-opacity-25 text-light border-secondary"
            />
          </Form.Group>

          {/* 🖼 Current Images */}
          <div className="mb-4">
            <Form.Label>Current Images</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {previewUrls.length > 0 ? (
                previewUrls.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    height="100"
                    width="100"
                    rounded
                    className="border border-info"
                  />
                ))
              ) : (
                <span className="text-muted">No images available</span>
              )}
            </div>
          </div>

          {/* 🖼 Upload new images */}
          <Form.Group className="mb-4">
            <Form.Label>Upload New Images (optional)</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleImageChange}
              className="bg-secondary bg-opacity-25 text-light border-secondary"
            />
          </Form.Group>

          <Button type="submit" variant="info" className="w-100 fw-semibold py-2">
            <FaSave className="me-2" /> Update Product
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ProductEdit;
