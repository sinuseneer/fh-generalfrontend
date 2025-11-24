import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import emailjs from "emailjs-com";
import { Box, Card as MuiCard, CardMedia } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import "./ProductDetails.css";
import api_uri, { base_uri } from "../../config/api";

export default function ProductDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const thumbRef = useRef(null);

  const passedProduct = location.state?.product;
  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);
  const [selectedImage, setSelectedImage] = useState("/images/no-image.jpg");

  // Touch swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Inquiry form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const normalizeImg = (img) =>
    img ? (img.startsWith("http") ? img : `${base_uri}${img}`) : null;

  useEffect(() => {
    if (passedProduct) {
      const mainImg = normalizeImg(passedProduct.main_image);
      const galleryImgs = (passedProduct.gallery || [])
        .filter(Boolean)
        .map(normalizeImg);

      const firstImg = mainImg || galleryImgs[0] || "/images/no-image.jpg";
      setSelectedImage(firstImg);
    }
  }, [passedProduct]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${api_uri}product/userview/${id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);

          const mainImg = normalizeImg(data.product.main_image);
          const galleryImgs = (data.product.gallery || [])
            .filter(Boolean)
            .map(normalizeImg);

          setSelectedImage(mainImg || galleryImgs[0] || "/images/no-image.jpg");
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("❌ Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!passedProduct && id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Swipe logic
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = (allImages) => {
    if (!touchStart || !touchEnd) return;

    const diff = touchStart - touchEnd;
    if (Math.abs(diff) < 50) return;

    const i = allImages.findIndex((img) => img === selectedImage);

    if (diff > 0 && i < allImages.length - 1) {
      setSelectedImage(allImages[i + 1]);
    } else if (diff < 0 && i > 0) {
      setSelectedImage(allImages[i - 1]);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Send inquiry
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.info("Sending message...", { autoClose: false });

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      product_name: product?.product_name || "Unknown Product",
    };

    try {
      await emailjs.send(
        "service_dq1kvps",
        "template_enjtl4e",
        templateParams,
        "tGZK_yhhP8blh1oT-"
      );

      toast.dismiss(toastId);
      toast.success("Message sent successfully!");

      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to send message.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading product details...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5 text-center">
        <h3>Product not found</h3>
        <Button onClick={() => navigate("/product")}>Back</Button>
      </Container>
    );
  }

  const allImages = [product.main_image, ...(product.gallery || [])]
    .filter(Boolean)
    .map(normalizeImg);

  return (
    <Container className="my-5">
      <ToastContainer position="top-center" />

      {/* Back button */}
      <p
        onClick={() => navigate("/product")}
        style={{
          cursor: "pointer",
          color: "#222",
          fontSize: "15px",
          marginBottom: "15px",
          userSelect: "none",
        }}
      >
        ← Back to Products
      </p>

      <Row className="mb-4 mt-3">
        {/* LEFT — Main Image */}
        <Col md={6} className="text-center">
          <Box
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(allImages)}
          >
            <MuiCard className="product-main-card">
              <CardMedia
                component="img"
                image={selectedImage}
                alt={product.product_name}
                onError={(e) => (e.target.src = "/images/no-image.jpg")}
              />
            </MuiCard>
          </Box>

          {/* Thumbnails */}
          <Box ref={thumbRef} className="thumbnail-scroll desktop-thumbs">
            {allImages.map((img, index) => (
              <MuiCard
                key={index}
                className={`thumbnail-card ${
                  selectedImage === img ? "active" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <CardMedia component="img" image={img} />
              </MuiCard>
            ))}
          </Box>
        </Col>

        {/* RIGHT — Details */}
        <Col md={6}>
          <Card className="p-2 mt-1 border-0">
            <h2 className="fw-bold">{product.product_name}</h2>
            <p>
              <strong>ID:</strong> {product.prod_id}
            </p>

            {/* Description */}
            {product.description && (
              <Card className="p-2 mt-1 border-0">
                <p className="mb-0">{product.description}</p>
              </Card>
            )}

            {/* WhatsApp Button */}
            <Button
              href={`https://wa.me/13478694095?text=Hi,%20I'm%20interested%20in%20${product.product_name}`}
              target="_blank"
              variant="success"
              className="mt-3 px-4 py-2"
              style={{
                width: "180px",
                backgroundColor: "#128C7E",
                border: "none",
                borderRadius: "8px",
              }}
            >
              WhatsApp Now
            </Button>
          </Card>

          {/* Inquiry form */}
          <Card className="p-4 mt-3 border-2">
            <h5>Submit Your Inquiry to Know More</h5>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="message"
                  placeholder="Enter your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button className="mt-3" type="submit">
                Send Message
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* FULL WIDTH SPECIFICATIONS */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="p-4 border-0">
            <h5 className="mb-3">Specifications</h5>

            {Array.isArray(product.product_info) &&
            product.product_info.length > 0 ? (
              <table className="table table-bordered">
                <tbody>
                  {(() => {
                    const rows = [];
                    for (let i = 0; i < product.product_info.length; i += 2) {
                      const a = product.product_info[i];
                      const b = product.product_info[i + 1];

                      rows.push(
                        <tr key={i}>
                          <th style={{ fontWeight: "bold", width: "25%" }}>
                            {a?.key}
                          </th>
                          <td style={{ width: "25%" }}>{a?.value}</td>

                          {b ? (
                            <>
                              <th style={{ fontWeight: "bold", width: "25%" }}>
                                {b.key}
                              </th>
                              <td style={{ width: "25%" }}>{b.value}</td>
                            </>
                          ) : (
                            <>
                              <th></th>
                              <td></td>
                            </>
                          )}
                        </tr>
                      );
                    }
                    return rows;
                  })()}
                </tbody>
              </table>
            ) : (
              <p>No specifications available.</p>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
