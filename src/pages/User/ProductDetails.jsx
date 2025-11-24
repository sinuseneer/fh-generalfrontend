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
  const { id } = useParams();
  const location = useLocation();
  const thumbRef = useRef(null);

  const passedProduct = location.state?.product;
  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);
  const [selectedImage, setSelectedImage] = useState("/images/no-image.jpg");

  // Thumbnail scroll arrows
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Swipe
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
    if (thumbRef.current) {
      const el = thumbRef.current;
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollWidth > el.clientWidth + el.scrollLeft);
    }
  }, [product, selectedImage]);

  const checkArrows = () => {
    const el = thumbRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollLeft = () => {
    thumbRef.current.scrollBy({ left: -150, behavior: "smooth" });
    setTimeout(checkArrows, 300);
  };

  const scrollRight = () => {
    thumbRef.current.scrollBy({ left: 150, behavior: "smooth" });
    setTimeout(checkArrows, 300);
  };

  // Load product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${api_uri}product/userview/${id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);

          const main = normalizeImg(data.product.main_image);
          const gallery = (data.product.gallery || [])
            .filter(Boolean)
            .map(normalizeImg);

          setSelectedImage(main || gallery[0] || "/images/no-image.jpg");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!passedProduct) fetchProduct();
  }, [id]);

  // Swipe handlers
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = (allImages) => {
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) < 40) return;

    const i = allImages.indexOf(selectedImage);
    if (diff > 0 && i < allImages.length - 1) setSelectedImage(allImages[i + 1]);
    if (diff < 0 && i > 0) setSelectedImage(allImages[i - 1]);

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Inquiry submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.info("Sending...", { autoClose: false });

    try {
      await emailjs.send(
        "service_dq1kvps",
        "template_enjtl4e",
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
          product_name: product.product_name,
        },
        "tGZK_yhhP8blh1oT-"
      );

      toast.dismiss(toastId);
      toast.success("Message sent!");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to send message.");
    }
  };

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );

  if (!product)
    return (
      <Container className="text-center my-5">
        <h3>Product Not Found</h3>
      </Container>
    );

  const allImages = [product.main_image, ...(product.gallery || [])]
    .filter(Boolean)
    .map(normalizeImg);

  return (
    <Container className="my-5">
      <ToastContainer position="top-center" />

      {/* Back Text */}
      <p
        onClick={() => navigate("/product")}
        className="back-text"
      >
        ← Back to Products
      </p>

      <Row>
        {/* LEFT — MAIN IMAGE */}
        <Col md={6} className="text-center">
          <Box
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(allImages)}
          >
            <MuiCard className="product-main-card no-shadow">
              <CardMedia component="img" image={selectedImage} />
            </MuiCard>
          </Box>

          {/* Thumbnail scroll with arrows */}
          <div className="thumb-wrapper">
            {showLeftArrow && (
              <button className="thumb-arrow left" onClick={scrollLeft}>
                ❮
              </button>
            )}

            <Box
              ref={thumbRef}
              className="thumbnail-scroll"
              onScroll={checkArrows}
            >
              {allImages.map((img, i) => (
                <MuiCard
                  key={i}
                  className={`thumbnail-card no-shadow ${
                    selectedImage === img ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <CardMedia component="img" image={img} />
                </MuiCard>
              ))}
            </Box>

            {showRightArrow && (
              <button className="thumb-arrow right" onClick={scrollRight}>
                ❯
              </button>
            )}
          </div>
        </Col>

        {/* RIGHT — DETAILS */}
        <Col md={6}>
          <Card className="border-0 p-2 no-shadow">
            <h2 className="fw-bold">{product.product_name}</h2>
            <p><strong>ID:</strong> {product.prod_id}</p>

            {product.description && (
              <p className="mt-2">{product.description}</p>
            )}

            {/* WhatsApp Button (small) */}
            <Button
              href={`https://wa.me/13478694095?text=Hi, I'm interested in ${product.product_name}`}
              target="_blank"
              variant="success"
              className="whatsapp-btn"
            >
              WhatsApp Now
            </Button>
          </Card>

          {/* Inquiry Form */}
          <Card className="p-3 mt-3 border-0 no-shadow">
            <h5>Submit Your Inquiry</h5>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Control
                      placeholder="Name"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Control
                      placeholder="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                <Form.Control
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Message"
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Button type="submit" className="mt-3">
                Send Message
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* SPECIFICATIONS FULL WIDTH */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="p-3 border-0 no-shadow">
            <h5>Specifications</h5>

            {Array.isArray(product.product_info) &&
            product.product_info.length > 0 ? (
              <table className="table table-bordered mt-3">
                <tbody>
                  {product.product_info.map((row, i) => (
                    <tr key={i}>
                      <th style={{ width: "30%", fontWeight: "bold" }}>
                        {row.key}
                      </th>
                      <td>{row.value}</td>
                    </tr>
                  ))}
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
