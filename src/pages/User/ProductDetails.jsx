import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import api_uri, { base_uri } from "../../config/api";
import { Box, IconButton, Card as MuiCard, CardMedia } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import "../../App.css";
import "./ProductDetails.css"

export default function ProductDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const thumbRef = useRef(null); // ✅ reference for thumbnail scroll

  const passedProduct = location.state?.product;
  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    caption: "",
    message: "",
  });

  // ✅ Fetch product data
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${api_uri}product/userview/${id}`);
      if (res.data.success) {
        setProduct(res.data.product);
        // prefix image path with base_uri so image URLs resolve correctly
        if (res.data.product.main_image) {
          setSelectedImage(`${base_uri}${res.data.product.main_image}`);
        }
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error("❌ Error loading product:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    fetchProduct();
  }
}, [id]); // ✅ only depend on id


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Message sent!\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    );
    setFormData({ name: "", phone: "", email: "", caption: "", message: "" });
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p>Loading product details...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5 text-center">
        <h3>Product not found</h3>
        <Button variant="secondary" onClick={() => navigate("/product")}>
          Back
        </Button>
      </Container>
    );
  }

  // ✅ Prepare all images (main + gallery)
  // ensure gallery images are full URLs
  const normalizeImg = (img) => (img && img.startsWith("http") ? img : `${base_uri}${img}`);
  const allImages = [product.main_image, ...(product.gallery || [])]
    .filter(Boolean)
    .map(normalizeImg);
  console.log("✅ allImages array:", allImages);
  console.log("✅ selectedImage:", selectedImage);

  return (
    <Container className="my-5">
      <Row className="align-items-start g-4">
        {/* 🖼️ Left Column - Horizontal Image Gallery */}
        <Col md={6} className="text-center">
          {/* Main Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 2,
              mb: 2,
              p: 1,
            }}
          >
            <MuiCard
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                width: "100%",
                maxWidth: 550,
              }}
            >
              <CardMedia
                component="img"
                image={selectedImage}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  transition: "0.3s ease",
                }}
                onError={(e) => (e.target.src = "/images/no-image.jpg")}
              />
            </MuiCard>
          </Box>

          {/* Horizontal Thumbnails */}
          <Box sx={{ position: "relative", width: "100%", maxWidth: 480, mx: "auto" }}>
            {/* Left arrow */}
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                zIndex: 2,
                backgroundColor: "white",
                border:1,
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
              onClick={() => (thumbRef.current.scrollLeft -= 100)}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>

            {/* Scrollable Thumbnails */}
            <Box
              ref={thumbRef}
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                scrollBehavior: "smooth",
                p: 1,
                
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {allImages.map((img, index) => (
                <MuiCard
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  sx={{
                    flex: "0 0 auto",
                    width: 80,
                    height: 80,
                    border:
                      selectedImage === img
                        ? "2px solid #2EA898"
                        : "1px solid #ddd",
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { border: "2px solid #37b24d" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={img}
                    alt={`Thumbnail ${index}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    onError={(e) => (e.target.src = "/images/no-image.jpg")}
                  />
                </MuiCard>
              ))}
            </Box>

            {/* Right arrow */}
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                zIndex: 2,
                backgroundColor: "white",
                boxShadow: 1,
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
              onClick={() => (thumbRef.current.scrollLeft += 100)}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </Box>
        </Col>

        {/* 📋 Right Column - Product Info & Inquiry Form */}
        <Col md={6}>
          <Card className="p-4 shadow-sm border-0">
            <h2 className="mb-3">{product.name}</h2>
            <p>
              <strong>Product ID:</strong> {product.prod_id}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>{product.description}</p>

            {product.product_info && (
              <p className="text-muted">
                <strong>More Info:</strong> {product.product_info}
              </p>
            )}

            <div className="d-flex gap-3 flex-wrap mt-3 mb-4">
              <Button
                className="whatsapp1-btn btn-sm d-flex align-items-center"
                href={`https://wa.me/91xxxxxxxx?text=Hi, I’d like to know more about ${product.name}`}
                target="_blank"
                variant="success"
              >
                <i className="bi bi-whatsapp me-2"></i> WhatsApp Now
              </Button>
            </div>

            <hr />
            <h5 className="mb-3">Submit your inquiry to know more.</h5>

            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your phone number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your message here..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="text-center">
                <Button type="submit" className="custom-btn px-5">
                  Send Message
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
