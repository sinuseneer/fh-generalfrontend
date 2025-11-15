import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "../App.css";
import "./Featureproducts.css";
import axios from "axios";
import api_uri, { base_uri } from "../config/api"; // ✅ adjust path if needed
import { useNavigate, Link } from "react-router-dom";

// Custom Mobile Slider Component
const CustomMobileSlider = ({ products }) => {
  const containerRef = useRef(null);

  // Ensure the scroll position is at the start when products change/mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // small timeout to ensure layout/paint has occurred
    const t = setTimeout(() => {
      el.scrollLeft = 0;
    }, 0);
    return () => clearTimeout(t);
  }, [products]);

  return (
    <div className="custom-mobile-slider">
      <div className="slider-container" ref={containerRef}>
        <div className="slider-track">
          {products.map((product) => (
            <div key={product.prod_id} className="mobile-slide">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <div className="feature-card text-center">
                  <div className="feature-image-wrapper">
                    <img
                      src={`${base_uri}/${product.main_image}`}
                      alt={product.product_name}
                    />
                  </div>
                  <h6 className="fw-semibold mt-3">{product.product_name}</h6>
                  <p className="text-muted small">{product.prod_id}</p>
                </div>
              </Link>
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
        console.log(res)
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
    centerMode: false,
    centerPadding: "0px",
    variableWidth: false,
    initialSlide: 0,
    arrows: true,
    // Do not autoplay on desktop; slides should change only via buttons
    autoplay: false,
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
              <div className="text-start mt-4">
                <Button variant="dark" className="view-all-btn px-4 py-2">
                  VIEW ALL
                </Button>
              </div>
          </>
        ) : (
          <Slider {...settings}>
              {products.map((product) => (
                <div key={product.prod_id} className="text-center">
                  <Link to={`/product/${product._id}`} className="text-decoration-none">
                    <div className="feature-card">
                      <div className="feature-image-wrapper">
                        <img
                          src={`${base_uri}/${product.main_image}`}
                          alt={product.product_name}
                        />
                      </div>
                      <h6 className="fw-semibold mt-3">{product.product_name}</h6>
                      <p className="text-muted small">{product.prod_id}</p>
                    </div>
                  </Link>
                </div>
              ))}
          </Slider>
        )}
      </Container>
    </section>
  );
}
