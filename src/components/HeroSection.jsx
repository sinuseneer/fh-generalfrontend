import React, { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { api_uri, base_uri } from "../config/api";
import "../App.css";
import "./HeroSection.css";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");

  // ===========================================================
  //             FETCH ACTIVE BANNERS SORTED BY ORDER
  // ===========================================================
  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${api_uri}banners/active`);

      const formatted = (res.data || []).map((b) => ({
        id: b._id,
        title: b.title || "",
        subtitle: b.subtitle || "",
        textMode: b.textMode || "dark",
        desktop: `${base_uri}${b.image}`,
        mobile: `${base_uri}${b.mobileImage}`,
      }));

      setSlides(formatted);
      setCurrentSlide(0);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ===========================================================
  //         HANDLE RESPONSIVE (MOBILE BREAKPOINT)
  // ===========================================================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===========================================================
  //                     SLIDER LOGIC
  // ===========================================================
  const nextSlide = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;

    setDirection("next");
    setIsTransitioning(true);

    setCurrentSlide((prev) => (prev + 1) % slides.length);

    setTimeout(() => setIsTransitioning(false), 600);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;

    setDirection("prev");
    setIsTransitioning(true);

    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    setTimeout(() => setIsTransitioning(false), 600);
  }, [slides.length, isTransitioning]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;

    setDirection(index > currentSlide ? "next" : "prev");
    setIsTransitioning(true);
    setCurrentSlide(index);

    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Autoplay
  useEffect(() => {
    if (slides.length === 0) return;

    const autoplay = setInterval(nextSlide, 5000);
    return () => clearInterval(autoplay);
  }, [nextSlide, slides.length]);

  // ===========================================================
  //                      TEXT COLORS
  // ===========================================================
  const getTextColors = (mode) => {
    return mode === "light"
      ? { title: "#fff", subtitle: "#efefef" }
      : { title: "#fff", subtitle: "#fff" };
  };

  return (
    <Container fluid className="p-0 custom-hero-wrapper">
      <div className="custom-carousel">
        
        {/* SLIDES TRACK */}
        <div
          className="carousel-slides"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const active = index === currentSlide ? "active" : "";
            const animDir = isTransitioning ? direction : "";
            const colors = getTextColors(slide.textMode);
            const image = isMobile ? slide.mobile : slide.desktop;

            return (
              <div
                key={slide.id}
                className={`carousel-slide ${active} ${animDir}`}
              >
                {/* Background */}
                <div
                  className="slide-image"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="slide-overlay"></div>
                </div>

                {/* Text Content */}
                <div className="slide-content">
                  <div className="slide-text-wrapper">
                    <h1 className="slide-title" style={{ color: colors.title }}>
                      {slide.title}
                    </h1>

                    <p className="slide-subtitle" style={{ color: colors.subtitle }}>
                      {slide.subtitle}
                    </p>

                    <button className="learn-more-btn">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ARROWS */}
        {slides.length > 1 && (
          <div className="carousel-controls-container">
            <button
              className="carousel-nav carousel-nav-prev"
              onClick={prevSlide}
            >
              <svg width="24" height="24" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              className="carousel-nav carousel-nav-next"
              onClick={nextSlide}
            >
              <svg width="24" height="24" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {/* DOT INDICATORS */}
        {slides.length > 1 && (
          <div className="carousel-indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
