import React, { useEffect, useState } from "react";
import { Carousel, Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { api_uri, base_uri } from "../config/api";
import "../App.css";

export default function HeroSection() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios
      .get(`${api_uri}banners/active`)
      .then((res) => setBanners(res.data.slice(0, 2))) // only show 2 active
      .catch(() => console.error("Failed to load banners"));
  }, []);

  return (
    <Container fluid className="p-0">
      {banners.length > 0 && (
        <Carousel fade interval={4000} className="hero-carousel">
          {banners.map((banner, index) => (
            <Carousel.Item key={index}>
              <div className="hero-slide-bg">
                <div
                  className="hero-background"
                  style={{
                    backgroundImage: `url(${base_uri}${banner.image})`,
                  }}
                />
                <Container className="hero-content-wrapper">
                  <Row className="h-100">
                    <Col lg={5} md={6} sm={12} className="d-flex align-items-center">
                      <div className="hero-text-content text-dark">
                        <h1 className="fw-bold mb-3">{banner.title}</h1>
                        <p className="mb-4 fs-5">{banner.subtitle}</p>
                        <Button variant="light" className="custom-btn">
                          Learn More
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
}
