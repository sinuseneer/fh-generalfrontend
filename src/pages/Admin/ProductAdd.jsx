import React, { useState, useEffect } from "react";
import axios from "axios";
import api_uri from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { FaUpload, FaSave, FaPlus, FaTrash } from "react-icons/fa";

function ProductAdd() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    prod_id: "",
    product_name: "",
    CAT_ID: "",
    description: "", // now unused but kept for safety
  });

  // Dynamic key-value rows for product_info
  const [infoRows, setInfoRows] = useState([{ key: "", value: "" }]);

  const navigate = useNavigate();

  // Load categories
  useEffect(() => {
    axios
      .post(`${api_uri}category/view`)
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Handle input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  // Add row to product_info
  const addRow = () => {
    setInfoRows([...infoRows, { key: "", value: "" }]);
  };

  // Remove row from product_info
  const removeRow = (index) => {
    const updated = infoRows.filter((_, i) => i !== index);
    setInfoRows(updated);
  };

  // Update each key/value row
  const updateRow = (index, field, value) => {
    const updated = [...infoRows];
    updated[index][field] = value;
    setInfoRows(updated);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.prod_id ||
      !formData.product_name ||
      !formData.CAT_ID
    ) {
      return toast.warning("Please fill all required fields");
    }

    try {
      // Send product details
      const productData = {
        ...formData,
        product_info: infoRows,
      };

      const res = await axios.post(`${api_uri}product/add`, productData);

      if (res.data.success) {
        const productId = res.data.product._id;

        // Upload images if any
        if (images.length > 0) {
          const imgForm = new FormData();
          images.forEach((file) => imgForm.append("images", file));

          await axios.post(
            `${api_uri}product/upload-images/${productId}`,
            imgForm,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        toast.success("Product added successfully!");
        setTimeout(() => navigate("/admin/products/list"), 1500);
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Server error while adding product");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "900px" }}>
      <Card
        className="p-4 shadow-lg rounded-4"
        style={{
          backgroundColor: "#1c1e22",
          color: "#e4e6eb",
          border: "none",
        }}
      >
        <h3
          className="fw-semibold text-center mb-4"
          style={{ color: "#dcdcdc", letterSpacing: "0.5px" }}
        >
          Add New Product
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
                  placeholder="Enter Product ID"
                  style={{
                    backgroundColor: "#2a2d33",
                    border: "1px solid #333",
                    color: "#fff",
                  }}
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
                  placeholder="Enter Product Name"
                  style={{
                    backgroundColor: "#2a2d33",
                    border: "1px solid #333",
                    color: "#fff",
                  }}
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
              style={{
                backgroundColor: "#2a2d33",
                border: "1px solid #333",
                color: "#fff",
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* PRODUCT INFO DYNAMIC KEY VALUE TABLE */}
          <Form.Group className="mb-4">
            <Form.Label>Product Info (Key - Value)</Form.Label>

            {infoRows.map((row, index) => (
              <Row key={index} className="mb-2">
                <Col md={5}>
                  <Form.Control
                    value={row.key}
                    placeholder="Feature Name"
                    onChange={(e) =>
                      updateRow(index, "key", e.target.value)
                    }
                    style={{
                      backgroundColor: "#2a2d33",
                      border: "1px solid #444",
                      color: "#fff",
                    }}
                  />
                </Col>

                <Col md={5}>
                  <Form.Control
                    value={row.value}
                    placeholder="Feature Value"
                    onChange={(e) =>
                      updateRow(index, "value", e.target.value)
                    }
                    style={{
                      backgroundColor: "#2a2d33",
                      border: "1px solid #444",
                      color: "#fff",
                    }}
                  />
                </Col>

                <Col md={2}>
                  <Button
                    variant="danger"
                    onClick={() => removeRow(index)}
                    disabled={infoRows.length === 1}
                    className="w-100"
                  >
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              variant="success"
              className="mt-2"
              onClick={addRow}
            >
              <FaPlus /> Add Row
            </Button>
          </Form.Group>

          {/* IMAGES */}
          <Form.Group className="mb-4">
            <Form.Label>Upload Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleImageChange}
              style={{
                backgroundColor: "#2a2d33",
                border: "1px solid #333",
                color: "#aaa",
              }}
            />
            <div className="mt-3 d-flex flex-wrap gap-3">
              {previewUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  height="100"
                  width="100"
                  thumbnail
                />
              ))}
            </div>
          </Form.Group>

          <Button
            type="submit"
            className="w-100 fw-semibold py-2"
            style={{
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
            }}
          >
            <FaSave className="me-2" /> Save Product
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ProductAdd;
