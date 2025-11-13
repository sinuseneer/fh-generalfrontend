import React from "react";
import { Carousel, Container, Row, Col, Button } from "react-bootstrap";
import "../App.css";

export default function HeroSection() {
  // Use import.meta.env.BASE_URL — works in Vite, CRA, and GitHub Pages
  const baseURL = import.meta.env.BASE_URL || process.env.PUBLIC_URL || "";

  return (
    <Container fluid className="p-0">
      <Carousel fade interval={4000} className="hero-carousel">

        {/* ===== First Slide ===== */}
        <Carousel.Item>
          <div className="hero-slide-bg">
            <div 
              className="hero-background"
              style={{
                backgroundImage: `url(/images/Group 35.jpg)`,
              }}
            />
            <Container className="hero-content-wrapper">
              <Row className="h-100">
                <Col lg={5} md={6} sm={12} className="d-flex align-items-start align-items-md-center">
                  <div className="hero-text-content text-white">
                    <h1 className="fw-bold mb-3">
                      Innovation Meets <br /> Excellence
                    </h1>
                    <p className="mb-4 fs-5">
                      Delivering next-generation technology for a smarter, safer tomorrow.
                    </p>
                    <Button variant="light" className="custom-btn">
                      Learn More
                    </Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>

        {/* ===== Second Slide ===== */}
        <Carousel.Item>
          <div className="hero-slide-bg">
            <div 
              className="hero-background"
              style={{
                backgroundImage: `/images/frames/Group 35.jpg)`,
              }}
            />
            <Container className="hero-content-wrapper">
              <Row className="h-100">
                <Col lg={5} md={6} sm={12} className="d-flex align-items-start align-items-md-center">
                  <div className="hero-text-content text-dark">
                    <h1 className="fw-bold mb-3">
                      Precision & <br /> Performance
                    </h1>
                    <p className="mb-4 fs-5">
                      Trusted equipment engineered to power professional solutions.
                    </p>
                    <Button variant="light" className="custom-btn">
                      Learn More
                    </Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>

      </Carousel>
    </Container>
  );
}
