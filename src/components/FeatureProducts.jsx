import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../App.css";
import "./Featureproducts.css";

const products = [
  {
    name: "First Aid Cart",
    code: "FHR-ET07",
    img: "/images/featureproducts/featureproduct1.jpg",
  },
  {
    name: "Electric Operating Table",
    code: "OTE-4",
    img: "/images/featureproducts/featureproduct2.jpg",
  },
  {
    name: "Three Function Dialysis Chair",
    code: "FHZ-E04",
    img: "/images/featureproducts/featureproduct3.jpg",
  },
  {
    name: "Overbed Table",
    code: "FHT01",
    img: "/images/featureproducts/featureproduct4.jpg",
  },
  {
    name: "Examination Couch",
    code: "FHZ-E06",
    img: "/images/featureproducts/featureproduct5.jpg",
  },
];

// Custom Mobile Slider Component
const CustomMobileSlider = ({ products }) => {
  return (
    <div className="custom-mobile-slider">
      <div 
        className="slider-container"
      >
        <div className="slider-track">
          {products.map((product, index) => (
            <div key={index} className="mobile-slide">
              <div className="feature-card text-center">
                <div className="feature-image-wrapper">
                  <img
                    src={product.img}
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

  // Check if screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
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
      {
        breakpoint: 1200,
        settings: { 
          slidesToShow: 3, 
          slidesToScroll: 1,
          dots: true,
          arrows: true 
        },
      },
      {
        breakpoint: 992,
        settings: { 
          slidesToShow: 2, 
          slidesToScroll: 1,
          dots: true,
          arrows: false 
        },
      },
    ],
  };

  return (
    <section className="feature-products-section py-5">
      <Container>
        <Row className="align-items-center mb-4">
          <Col xs={12} md={8}>
            <h2 className="fw-bold mb-1 text-dark text-start">Feature Products</h2>
            <p className= "" style={{paddingLeft:"0px"}}>
              Discover our featured products designed with precision and care.
            </p>
          </Col>
          {/* Show button on desktop only */}
          {!isMobile && (
            <Col xs={12} md={4} className="text-end text-md-end text-center">
              <Button variant="dark" className="view-all-btn px-4 py-2">
                VIEW ALL
              </Button>
            </Col>
          )}
        </Row>

        {/* Conditional Rendering: Custom Mobile Slider or Slick Slider */}
        {isMobile ? (
          <>
            <CustomMobileSlider products={products} />
            {/* Show button below products on mobile */}
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
                    src={product.img}
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
