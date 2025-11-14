import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "../App.css";
import "./Featureproducts.css";
import axios from "axios";
import api_uri, { base_uri } from "../config/api"; // ✅ adjust path if needed
import { useNavigate } from "react-router-dom";

// Custom Mobile Slider Component
const CustomMobileSlider = ({ products }) => {
  return (
    <div className="custom-mobile-slider">
      <div className="slider-container">
        <div className="slider-track">
          {products.map((product, index) => (
            <div key={index} className="mobile-slide">
              <div className="feature-card text-center">
                <div className="feature-image-wrapper">
                  <img
                    src={`${base_uri}uploads/${product.image}`}
                    alt={product.name}
                    className="img-fluid"
                  />
                </div>
                <h6 className="fw-semibold mt-3">{product.name}</h6>
                <p className="text-muted small">{product.code}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FeatureProducts() {
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Check if screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // ✅ Fetch latest 10 products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${api_uri}product/latest?limit=10`);
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, arrows: true } },
      { breakpoint: 992, settings: { slidesToShow: 2, arrows: false } },
    ],
  };

  return (
    <section className="feature-products-section py-5">
      <Container>
        <Row className="align-items-center mb-4">
          <Col xs={12} md={8}>
            <h2 className="fw-bold mb-1 text-dark text-start">
              Feature Products
            </h2>
            <p style={{ paddingLeft: "0px" }}>
              Discover our featured products designed with precision and care.
            </p>
          </Col>

          {!isMobile && (
            <Col xs={12} md={4} className="text-end text-md-end text-center">
              <Button
                variant="dark"
                className="view-all-btn px-4 py-2"
                onClick={() => navigate("/product")}
              >
                VIEW ALL
              </Button>
            </Col>
          )}
        </Row>

        {/* Show loading spinner */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="dark" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted">No products found.</p>
        ) : isMobile ? (
          <>
            <CustomMobileSlider products={products} />
            <div className="text-center mt-4">
              <Button variant="dark" className="view-all-btn px-4 py-2">
                VIEW ALL
              </Button>
            </div>
          </>
        ) : (
          <Slider {...settings}>
            {products.map((product, index) => (
              <div key={index} className="feature-card text-center p-3">
                <div className="feature-image-wrapper">
                  <img
                    src={`${base_uri}uploads/${product.image}`}
                    alt={product.name}
                    className="img-fluid"
                  />
                </div>
                <h6 className="fw-semibold mt-3">{product.name}</h6>
                <p className="text-muted small">{product.code}</p>
              </div>
            ))}
          </Slider>
        )}
      </Container>
    </section>
  );
}
