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
import api_uri, { base_uri } from "../../config/api";

export default function ProductDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const passedProduct = location.state?.product;

  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);
  const [selectedImage, setSelectedImage] = useState("/images/no-image.jpg");

  const thumbRef = useRef(null);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [showThumbNav, setShowThumbNav] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const normalizeImg = (img) =>
    img ? (img.startsWith("http") ? img : `${base_uri}${img}`) : null;

  useEffect(() => {
    if (passedProduct) {
      const mainImg = normalizeImg(passedProduct.main_image);
      const galleryImgs = (passedProduct.gallery || [])
        .filter(Boolean)
        .map(normalizeImg);

      setSelectedImage(mainImg || galleryImgs[0] || "/images/no-image.jpg");
    }
  }, [passedProduct]);

  // Fetch product data if not passed from previous page
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
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (!passedProduct && id) fetchProduct();
  }, [id]);

  const allImages =
    product &&
    [product.main_image, ...(product.gallery || [])]
      .filter(Boolean)
      .map(normalizeImg);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTouchStart = (e) =>
    setTouchStart(e.targetTouches[0].clientX);

  const handleTouchMove = (e) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) < 50) return;

    const index = allImages.findIndex((img) => img === selectedImage);

    if (diff > 0 && index < allImages.length - 1)
      setSelectedImage(allImages[index + 1]);
    else if (diff < 0 && index > 0)
      setSelectedImage(allImages[index - 1]);

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Thumbnail scroll logic
  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;

    const updateScroll = () => {
      const needsNav = el.scrollWidth > el.clientWidth || allImages.length > 5;
      setShowThumbNav(needsNav);
      setCanScrollPrev(el.scrollLeft > 10);
      setCanScrollNext(el.scrollLeft + el.clientWidth + 10 < el.scrollWidth);
    };

    updateScroll();

    el.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateScroll);

    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [allImages?.length]);

  const scrollThumbs = (dir) => {
    const el = thumbRef.current;
    if (!el) return;
    const amount = dir === "next" ? el.clientWidth * 0.6 : -el.clientWidth * 0.6;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Send inquiry form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.info("Sending...", { autoClose: false });

    try {
      await emailjs.send(
        "service_dq1kvps",
        "template_enjtl4e",
        {
          ...formData,
          product_name: product?.product_name,
        },
        "tGZK_yhhP8blh1oT-"
      );

      toast.dismiss(toastId);
      toast.success("Message sent!");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to send.");
    }
  };

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner />
        <p>Loading product...</p>
      </Container>
    );

  if (!product)
    return (
      <Container className="text-center my-5">
        <h4>Product not found</h4>
        <Button onClick={() => navigate("/product")}>Back</Button>
      </Container>
    );

  return (
    <Container className="my-5">
      <ToastContainer />

      <p
        onClick={() => navigate("/product")}
        style={{ cursor: "pointer", fontSize: "15px", marginBottom: "15px" }}
      >
        ← Back to Products
      </p>

      <Row className="mb-4">
        {/* LEFT: IMAGES */}
        <Col md={6} className="text-center" style={{ position: "relative" }}>
          <Box
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <MuiCard className="product-main-card">
              <CardMedia
                component="img"
                image={selectedImage}
                className="main-product-image"
              />
            </MuiCard>
          </Box>

          {/* SCROLL BUTTONS */}
          {showThumbNav && (
            <>
              <div
                className={`thumb-btn thumb-btn-prev ${
                  canScrollPrev ? "visible" : "hidden"
                }`}
                onClick={() => scrollThumbs("prev")}
              >
                ❮
              </div>

              <div
                className={`thumb-btn thumb-btn-next ${
                  canScrollNext ? "visible" : "hidden"
                }`}
                onClick={() => scrollThumbs("next")}
              >
                ❯
              </div>
            </>
          )}

          {/* THUMBNAILS with WRAPPER */}
          <div className="thumbnail-wrapper">
            <Box ref={thumbRef} className="thumbnail-scroll">
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
          </div>
        </Col>

        {/* RIGHT: PRODUCT DETAILS */}
        <Col md={6}>
          <Card className="p-2 border-0">
            <h2 className="fw-bold">
              {product.name || product.product_name}
            </h2>

            <p>
              <strong>ID:</strong> {product.prod_id}
            </p>

            {product.description && (
              <Card className="p-2 border-0">
                <p>{product.description}</p>
              </Card>
            )}

            <Button
              href={`https://wa.me/13478694095?text=Hi, I'm interested in ${product.product_name}`}
              target="_blank"
              className="mt-3 px-4 py-2"
              style={{
                width: "180px",
                background: "#128C7E",
                borderRadius: "8px",
                border: "none",
              }}
            >
              WhatsApp Now
            </Button>
          </Card>

          {/* INQUIRY FORM */}
          <Card className="p-4 mt-3">
            <h5>Submit Inquiry</h5>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your name"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      placeholder="Phone number"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Email address"
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  placeholder="Message..."
                />
              </Form.Group>

              <Button className="mt-3" type="submit">
                Send Message
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* SPECIFICATIONS */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="p-4 border-0">
            <h5>Specifications</h5>

            {Array.isArray(product.product_info) &&
            product.product_info.length > 0 ? (
              <table className="table table-bordered">
                <tbody>
                  {product.product_info.map((row, i) => {
                    if (i % 2 === 0) {
                      const a = product.product_info[i];
                      const b = product.product_info[i + 1];
                      return (
                        <tr key={i}>
                          <th>{a?.key}</th>
                          <td>{a?.value}</td>

                          {b ? (
                            <>
                              <th>{b.key}</th>
                              <td>{b.value}</td>
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
                    return null;
                  })}
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
