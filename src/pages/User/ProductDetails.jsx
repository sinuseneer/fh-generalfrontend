import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import emailjs from "emailjs-com";
import { Box, IconButton, Card as MuiCard, CardMedia } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
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

  // Touch/swipe state for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // ✅ Normalize image URLs
  const normalizeImg = (img) =>
    img ? (img.startsWith("http") ? img : `${base_uri}${img}`) : null;

  // ✅ Handle case when product is already passed via router
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

  // ✅ Fetch product from API if not passed via navigation
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

          // ✅ First available image as default
          const firstImg = mainImg || galleryImgs[0] || "/images/no-image.jpg";
          setSelectedImage(firstImg);
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

    if (!passedProduct && id) fetchProduct();
  }, [id]);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle touch/swipe for mobile image navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (allImages) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    const currentIndex = allImages.findIndex(img => img === selectedImage);
    
    if (distance > 0) {
      // Swipe left - next image
      if (currentIndex < allImages.length - 1) {
        setSelectedImage(allImages[currentIndex + 1]);
      }
    } else {
      // Swipe right - previous image
      if (currentIndex > 0) {
        setSelectedImage(allImages[currentIndex - 1]);
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // ✅ Send Email using EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.info("Sending message...", { autoClose: false });

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      product_name: product?.name || "Unknown Product",
    };

    try {
      await emailjs.send(
        "service_lk58uuc", // EmailJS service ID
        "template_h4n8zbn", // Template ID
        templateParams,
        "Gc1PPygtgpQKGULIe" // Public key
      );

      toast.dismiss(toastId);
      toast.success("✅ Message sent successfully!");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error("❌ Email send failed:", err);
      toast.dismiss(toastId);
      toast.error("⚠️ Failed to send message. Please try again.");
    }
  };

  // ✅ Handle loading and error states
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

  // ✅ Collect all images
  const allImages = [product.main_image, ...(product.gallery || [])]
    .filter(Boolean)
    .map(normalizeImg);

  // Parse backend description into a heading + bullet items
  const parseDescription = (desc) => {
    if (!desc || typeof desc !== "string") return { heading: null, items: [] };

    // Normalize line endings
    let s = desc.replace(/\r/g, "").trim();

    // If description contains explicit newlines, prefer those as separators
    // Otherwise split by common bullet symbols like ► • • or hyphen
    const bulletChars = /[►•\u2022\-]/;
    const firstBulletIndex = s.search(bulletChars);

    let heading = null;
    let rest = s;

    // If there's text before the first bullet and it looks like a heading (ends with ':'), keep it
    if (firstBulletIndex > 0) {
      const possibleHeading = s.slice(0, firstBulletIndex).trim();
      if (possibleHeading.endsWith(":")) {
        heading = possibleHeading;
        rest = s.slice(firstBulletIndex);
      }
    }

    let parts = [];
    if (rest.includes("\n")) {
      parts = rest.split("\n");
    } else {
      // Split by any of the bullet characters
      parts = rest.split(/[►•\u2022]/);
    }

    const items = parts
      .map((p) => p.replace(/^[:\s\-–—]+/, "").trim())
      .filter(Boolean);

    return { heading, items };
  };

  return (
    <Container className="my-5">
      <ToastContainer position="top-center" />

      {/* ---------- Back Button ---------- */}
      <Row className="mb-3">
        <Col xs={12}>
          <Button 
            variant="" 
            onClick={() => navigate("/product")}
            className="d-flex align-items-center"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Products
          </Button>
        </Col>
      </Row>

      {/* ---------- Image (left) and Product Details + Inquiry Form (right) ---------- */}
      <Row className="mb-4">
        {/* Left: Main Image + Thumbnails */}
        <Col xs={12} md={6} className="text-center">
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(allImages)}
          >
            <MuiCard
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                width: "100%",
                maxHeight: 560,
                /* use a very light border instead of a colored shadow */
                border: "1px solid #fcfcfc",
              }}
            >
              <CardMedia
                component="img"
                image={selectedImage}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "0.3s ease",
                }}
                onError={(e) => (e.target.src = "/images/no-image.jpg")}
              />
            </MuiCard>
          </Box>

          {/* Thumbnails */}
          <Box className="thumbnail-container" sx={{ position: "relative", width: "100%", maxWidth: 560, mr: "auto" }}>
            {allImages.length > 4 && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: -10,
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  backgroundColor: "white",
                  border: 1,
                  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => (thumbRef.current.scrollLeft -= 150)}
              >
                <ArrowBackIosNew fontSize="small" />
              </IconButton>
            )}

            <Box
              ref={thumbRef}
              sx={{
                display: "flex",
                gap: 1.5,
                overflowX: "auto",
                scrollBehavior: "smooth",
                p: 1,
                "&::-webkit-scrollbar": { height: "6px" },
                "&::-webkit-scrollbar-thumb": { 
                  backgroundColor: "#2EA898",
                  borderRadius: "3px"
                },
              }}
            >
              {allImages.map((img, index) => (
                <MuiCard
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  sx={{
                    flex: "0 0 auto",
                    width: 120,
                    height: 80,
                    border: selectedImage === img ? "2px solid #2EA898" : "1px solid #ddd",
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      border: "2px solid #37b24d",
                    },
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

            {allImages.length > 4 && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: -10,
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  backgroundColor: "white",
                  border: 1,
                  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => (thumbRef.current.scrollLeft += 150)}
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Mobile Dots Pagination */}
          <div className="mobile-dots-container" style={{ display: 'none' }}>
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`mobile-dot ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </Col>

        {/* Right: Product Details (without enquiry) */}
        <Col xs={12} md={6}>
          <Card className="p-4 border-0">
            <h2 className="mb-3 text-start">{product.name}</h2>
            <p><strong>ID:</strong> {product.prod_id}</p>
            {product.product_info?<p><strong>Product Info:</strong> {product.product_info}</p>:""}

            <div className="d-flex gap-3 flex-wrap mt-3 mb-4">
              <Button
                className="whatsapp1-btn d-flex align-items-center justify-content-center px-5"
                href={`https://wa.me/9188850311?text=Hi Sabitha,%0AI'm interested in your product:%0A👉 Name: ${product.name}%0A🆔 Product ID: ${product.prod_id}%0ACould you please share more details?`}
                target="_blank"
                variant="success"
              >
                <i className="bi bi-whatsapp me-2"></i> WhatsApp Now
              </Button>
            </div>
          </Card>
          {/* Inquiry form placed under the details on the right column */}
          <Card className="pt-0 p-4 shadow-sm border-0 mt-0">
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

              <div className="text-end">
                <Button type="submit" className="custom-btn px-4">
                  Send Message
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* ---------- Product Description (below the inquiry form) ---------- */}
      <Row className="mt-4">
        <Col xs={12} md={8} className="ml-auto">
          <Card className="p-4 border-0">
            <h5 className="mb-3">Product Description</h5>

            {(() => {
              const { heading, items } = parseDescription(product.description);
              if (items.length > 0) {
                return (
                  <div>
                    {heading && <p><strong>{heading}</strong></p>}
                    <ul className="product-bullets" style={{ paddingLeft: 0 }}>
                      {items.map((it, idx) => {
                        const [label, ...rest] = it.split(":");
                        if (rest.length > 0) {
                          return (
                            <li key={idx}>
                              <strong>{label.trim()}:</strong> {rest.join(":").trim()}
                            </li>
                          );
                        }
                        return <li key={idx}>{it}</li>;
                      })}
                    </ul>
                  </div>
                );
              }

              return <p>{product.description}</p>;
            })()}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
