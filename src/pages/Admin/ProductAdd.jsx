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
import { FaUpload, FaSave } from "react-icons/fa";
// import "react-quill/dist/quill.bubble.css";
// import ReactQuill from "react-quill";
// import { RichTextEditor } from "@mantine/rte";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";


function ProductAdd() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    prod_id: "",
    product_name: "",
    CAT_ID: "",
    description: "",
    product_info: "",
  });

  const navigate = useNavigate();

  // ✅ Fetch categories
  useEffect(() => {
    axios
      .post(`${api_uri}category/view`)
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  // ✅ Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.prod_id ||
      !formData.product_name ||
      !formData.CAT_ID ||
      !formData.description
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      // 1️⃣ Add product details
      const res = await axios.post(`${api_uri}product/add`, formData);

      if (res.data.success) {
        const productId = res.data.product._id;

        // 2️⃣ Upload product images
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
                <Form.Label className="fw-light">Product ID *</Form.Label>
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
                    borderRadius: "8px",
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-light">Product Name *</Form.Label>
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
                    borderRadius: "8px",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="fw-light">Category *</Form.Label>
            <Form.Select
              name="CAT_ID"
              value={formData.CAT_ID}
              onChange={handleChange}
              style={{
                backgroundColor: "#2a2d33",
                border: "1px solid #333",
                color: "#fff",
                borderRadius: "8px",
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
          <Form.Group className="mb-3">
            <Form.Label className="fw-light">Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              style={{
                backgroundColor: "#2a2d33",
                border: "1px solid #333",
                color: "#fff",
                borderRadius: "8px",
              }}
            />
          </Form.Group>

     {/* <Form.Group className="mb-4">
  <Form.Label className="fw-light">Product Info (optional)</Form.Label>
  <div
    style={{
      backgroundColor: "#2a2d33",
      borderRadius: "8px",
      border: "1px solid #333",
      padding: "8px",
    }}
  >
    <SimpleMDE
      value={formData.product_info}
      onChange={(value) => setFormData({ ...formData, product_info: value })}
      options={{
        spellChecker: false,
        placeholder: "Write technical or additional info here...",
        toolbar: [
          "bold",
          "italic",
          "heading",
          "|",
          "unordered-list",
          "ordered-list",
          "|",
          "link",
          "preview",
        ],
        status: false,
        renderingConfig: { singleLineBreaks: false },
      }}
    />
  </div>
</Form.Group> */}



          {/* 🖼 Image Upload Section */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-light">Upload Product Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleImageChange}
              style={{
                backgroundColor: "#2a2d33",
                border: "1px solid #333",
                color: "#aaa",
                borderRadius: "8px",
              }}
            />
            <div className="mt-3 d-flex flex-wrap gap-3">
              {previewUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt="preview"
                  thumbnail
                  height="100"
                  width="100"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #444",
                    backgroundColor: "#222",
                  }}
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
