import React, { useEffect, useState } from "react";
import axios from "axios";
import api_uri, { base_uri } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Image,
  Spinner,
} from "react-bootstrap";
import { FaSave, FaUpload, FaTrashAlt } from "react-icons/fa";

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
  const [productImages, setProductImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replaceImage, setReplaceImage] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setProductImages(product.images);
          setPreviewUrls(
            product.images.map((img) => `${base_uri}${img.image_path}`)
          );
        }
      }
    } catch {
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle multiple new images
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  // ✅ Replace single image in an existing slot
  const handleReplaceImage = (e) => {
    setReplaceImage(e.target.files[0]);
  };

  // ✅ Delete single image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await axios.delete(`${api_uri}product/image/${imageId}`);
      if (res.data.success) {
        toast.success("Image deleted successfully");
        loadProduct();
      }
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // ✅ Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Update product text fields
      const res = await axios.put(`${api_uri}product/update/${id}`, formData);

      if (res.data.success) {
        // 2️⃣ Replace single image slot (if selected)
        if (editingImageId && replaceImage) {
          const imgForm = new FormData();
          imgForm.append("image", replaceImage);
          await axios.put(
            `${api_uri}product/replace-image/${editingImageId}`,
            imgForm,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          toast.success("Image slot replaced successfully!");
        }

        // 3️⃣ Upload new images (if selected)
        if (newImages.length > 0) {
          const imgForm = new FormData();
          newImages.forEach((file) => imgForm.append("images", file));
          await axios.post(`${api_uri}product/upload-images/${id}`, imgForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("New images added successfully!");
        }

        // ✅ Reset fields and refresh
        setEditingImageId(null);
        setReplaceImage(null);
        setNewImages([]);
        loadProduct();

        toast.success("✅ Product updated successfully!");
        setTimeout(() => navigate("/admin/products/list"), 1500);
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
      toast.error("Server error while updating");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="info" />
      </div>
    );

  return (
    <Container className="mt-5" style={{ maxWidth: "900px" }}>
      <Card className="bg-dark text-light p-4 shadow-lg rounded-4">
        <h3 className="fw-bold text-uppercase mb-4 text-center text-info">
          Edit Product
        </h3>

        <Form onSubmit={handleSubmit}>
          {/* ✅ Product Info */}
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

          {/* 🖼 Current Images */}
          <div className="mb-4">
            <Form.Label>Current Images</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {productImages.length > 0 ? (
                productImages.map((img, idx) => (
                  <div
                    key={img._id}
                    className="p-2 rounded position-relative bg-dark"
                    style={{
                      border:
                        editingImageId === img._id
                          ? "3px solid #ff4d4f"
                          : "1px solid #0dcaf0",
                      width: "120px",
                    }}
                  >
                    <Image
                      src={`${base_uri}${img.image_path}`}
                      height="100"
                      width="100"
                      rounded
                      className="mb-2"
                    />
                    <div className="d-flex justify-content-between">
                      <Button
                        size="sm"
                        variant={
                          editingImageId === img._id ? "danger" : "warning"
                        }
                        onClick={() =>
                          setEditingImageId(
                            editingImageId === img._id ? null : img._id
                          )
                        }
                      >
                        {editingImageId === img._id ? "Cancel" : "Replace"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteImage(img._id)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-muted">No images available</span>
              )}
            </div>
          </div>

          {/* Replace selected image slot */}
          {editingImageId && (
            <Form.Group className="mb-4">
              <Form.Label>Replace Selected Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleReplaceImage}
                className="bg-secondary bg-opacity-25 text-light border-secondary"
              />
            </Form.Group>
          )}

          {/* Add new images */}
          <Form.Group className="mb-4">
            <Form.Label>Add New Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
              className="bg-secondary bg-opacity-25 text-light border-secondary"
            />
            {newImages.length > 0 && (
              <div className="d-flex flex-wrap gap-3 mt-3">
                {newImages.map((file, idx) => (
                  <Image
                    key={idx}
                    src={URL.createObjectURL(file)}
                    height="80"
                    width="80"
                    rounded
                    className="border border-warning"
                  />
                ))}
              </div>
            )}
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
