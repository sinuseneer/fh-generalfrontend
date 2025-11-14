import React, { useState, useEffect } from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import axios from "axios";
import { api_uri, base_uri } from "../config/api";
import "../App.css";

export default function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    axios
      .get(`${api_uri}banners/active`)
      .then((res) => {
        console.log("🔥 BANNERS:", res.data);
        setBanners(res.data);
      })
      .catch((err) => console.error("Banner load error:", err));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // TEXT COLOR BASED ON MODE
  const getTextColors = (mode) => {
    return mode === "light"
      ? { title: "#ffffff", subtitle: "#f0f0f0", buttonBg: "#ffffff", buttonText: "#000000" }
      : { title: "#000000", subtitle: "#222222", buttonBg: "#000000", buttonText: "#ffffff" };
  };

  return (
    <Container fluid className="p-0 hero-wrapper">
      {banners.length > 0 && (
        <Carousel fade interval={4000}>
          {banners.map((banner, idx) => {
            const image = isMobile
              ? banner.mobileImage || banner.image
              : banner.image;

            const colors = getTextColors(banner.textMode || "dark");

            return (
              <Carousel.Item key={idx}>
                <div
                  className="hero-background"
                  style={{
                    backgroundImage: `url(${base_uri}${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: isMobile ? "420px" : "550px",
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <div style={{ maxWidth: "60%" }}>
                    <h1 style={{ color: colors.title }}>
                      {banner.title}
                    </h1>

                    <p style={{ color: colors.subtitle }}>
                      {banner.subtitle}
                    </p>

                    <Button
                      style={{
                        backgroundColor: colors.buttonBg,
                        color: colors.buttonText,
                        border: "none",
                        padding: "10px 20px",
                        fontWeight: "bold",
                      }}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}
    </Container>
  );
}
