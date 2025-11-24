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
  Table,
} from "react-bootstrap";
import { FaSave, FaTrashAlt } from "react-icons/fa";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prod_id: "",
    product_name: "",
    CAT_ID: "",
    description: "",
    product_info: [],
  });

  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replaceImage, setReplaceImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load categories + product
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
          product_info: Array.isArray(product.product_info)
            ? product.product_info
            : [],
        });

        if (product.images?.length > 0) {
          setProductImages(product.images);
        }
      }
    } catch {
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  // Input text handling
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add New Images
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  // Replace existing image
  const handleReplaceImage = (e) => {
    setReplaceImage(e.target.files[0]);
  };

  // Delete Image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await axios.delete(`${api_uri}product/delete-image/${imageId}`);
      if (res.data.success) {
        toast.success("Image deleted");
        loadProduct();
      }
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // ======== PRODUCT INFO KEY-VALUE FUNCTIONS ========

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      product_info: [...prev.product_info, { key: "", value: "" }],
    }));
  };

  const updateRow = (index, field, value) => {
    const updated = [...formData.product_info];
    updated[index][field] = value;
    setFormData({ ...formData, product_info: updated });
  };

  const deleteRow = (index) => {
    const updated = formData.product_info.filter((_, i) => i !== index);
    setFormData({ ...formData, product_info: updated });
  };

  // ======== SUBMIT UPDATE ========
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update text fields + product_info
      const res = await axios.put(`${api_uri}product/update/${id}`, formData);

      if (res.data.success) {
        // Replace image slot
        if (editingImageId && replaceImage) {
          const imgForm = new FormData();
          imgForm.append("image", replaceImage);

          await axios.put(
            `${api_uri}product/replace-image/${editingImageId}`,
            imgForm,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        // Upload new images
        if (newImages.length > 0) {
          const imgForm = new FormData();
          newImages.forEach((file) => imgForm.append("images", file));

          await axios.post(`${api_uri}product/upload-images/${id}`, imgForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        toast.success("Product updated successfully!");
        setTimeout(() => navigate("/admin/products/list"), 1200);
      }
    } catch (err) {
      toast.error("Update failed");
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
        <h3 className="fw-bold text-center text-info mb-4">Edit Product</h3>

        <Form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Product ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="prod_id"
                  value={formData.prod_id}
                  onChange={handleChange}
                  className="bg-secondary bg-opacity-25 text-light"
                  required
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
                  className="bg-secondary bg-opacity-25 text-light"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Category */}
          <Form.Group className="mb-3">
            <Form.Label>Category *</Form.Label>
            <Form.Select
              name="CAT_ID"
              value={formData.CAT_ID}
              onChange={handleChange}
              className="bg-secondary bg-opacity-25 text-light"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-4">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-secondary bg-opacity-25 text-light"
            />
          </Form.Group>

          {/* PRODUCT INFO KEY-VALUE TABLE */}
          <Card className="p-3 mb-4 bg-secondary bg-opacity-25">
            <h5 className="text-info mb-3">Product Info (Key / Value)</h5>

            <Table bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th style={{ width: "70px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {formData.product_info.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        value={row.key}
                        onChange={(e) =>
                          updateRow(index, "key", e.target.value)
                        }
                        className="bg-dark text-light"
                      />
                    </td>

                    <td>
                      <Form.Control
                        type="text"
                        value={row.value}
                        onChange={(e) =>
                          updateRow(index, "value", e.target.value)
                        }
                        className="bg-dark text-light"
                      />
                    </td>

                    <td className="text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteRow(index)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={3} className="text-center">
                    <Button variant="info" size="sm" onClick={addRow}>
                      + Add New Row
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>

          {/* ===== IMAGES SECTION ===== */}
          <div className="mb-4">
            <Form.Label>Current Images</Form.Label>

            <div className="d-flex flex-wrap gap-3">
              {productImages.length === 0 && (
                <span className="text-muted">No images available</span>
              )}

              {productImages.map((img) => (
                <div
                  key={img._id}
                  className="p-2 rounded bg-dark border border-info"
                  style={{ width: "130px" }}
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
              ))}
            </div>
          </div>

          {editingImageId && (
            <Form.Group className="mb-4">
              <Form.Label>Replace Selected Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleReplaceImage}
                className="bg-secondary bg-opacity-25 text-light"
              />
            </Form.Group>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Add New Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
              className="bg-secondary bg-opacity-25 text-light"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="info"
            className="w-100 fw-semibold py-2"
          >
            <FaSave className="me-2" /> Update Product
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ProductEdit;
