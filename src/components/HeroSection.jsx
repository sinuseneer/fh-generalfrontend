import React, { useState, useEffect, useCallback } from "react";
import { Container, Button } from "react-bootstrap";
import "../App.css";
import "./HeroSection.css";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');

  const slides = [
    {
      title: "Precision. Performance. Reliability.",
      subtitle: "Explore a wide range of certified general and medical equipment built for professionals.",
      desktopImage: "/images/banners/Banner-1.jpg",
      mobileImage: "/images/banners/mobile-1.jpg",
      textMode: "light",
    },
    {
      title: " Heavy-Duty Sinotruk & Bedford Trucks – Brand New",
      subtitle: "Explore our powerful trucks built for heavy-duty tasks — reliable, strong, and built to perform.",
      desktopImage: "/images/banners/Banner-2.jpg",
      mobileImage: "/images/banners/mobile-2.jpg",
      textMode: "dark",
    },
    // {
    //   title: "Trusted Across Industries",
    //   subtitle: "From warehouses to worksites — built to last.",
    //   desktopImage: "/images/banners/desktop/banner3.jpg",
    //   mobileImage: "/images/banners/mobile/banner3.jpg",
    //   textMode: "light",
    // },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setDirection('next');
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setDirection('prev');
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setDirection(index > currentSlide ? 'next' : 'prev');
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  useEffect(() => {
    const autoplay = setInterval(nextSlide, 5000);
    return () => clearInterval(autoplay);
  }, [nextSlide]);

  const getTextColors = (mode) => {
    // Ensure title and button text are white for better contrast across banners
    return mode === "light"
      ? { title: "#ffffff", subtitle: "#f0f0f0", buttonBg: "#ffffff", buttonText: "#ffffff" }
      : { title: "#ffffff", subtitle: "#333333", buttonBg: "#000000", buttonText: "#ffffff" };
  };

  return (
    <Container fluid className="p-0 custom-hero-wrapper">
      <div className="custom-carousel">
        <div className="carousel-slides">
          {slides.map((slide, index) => {
            const colors = getTextColors(slide.textMode || "dark");
            const image = isMobile ? slide.mobileImage : slide.desktopImage;
            const isActive = index === currentSlide;
            const isPrev = index === (currentSlide - 1 + slides.length) % slides.length;
            const isNext = index === (currentSlide + 1) % slides.length;

            return (
              <div
                key={index}
                className={`carousel-slide ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''} ${isTransitioning ? direction : ''}`}
              >
                <div 
                  className="slide-image"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="slide-overlay"></div>
                </div>
                <div className="slide-content">
                  <div className="container">
                    <div className="slide-text-wrapper">
                    <h1 className="slide-title" style={{ color: colors.title }}>
                      {slide.title}
                    </h1>
                    <p className="slide-subtitle" style={{ color: "#fff" }}>
                      {slide.subtitle}
                    </p>
                    <button
                      className="slide-button text-dark"
                      style={{
                        backgroundColor: "#fff",
                        color: "#000",
                      }}
                    >
                      Learn More
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls aligned with navbar container */}
        <div className="container carousel-controls-container">
          <button
            className="carousel-nav carousel-nav-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            className="carousel-nav carousel-nav-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Dot Indicators inside container to align with navbar */}
        <div className="container">
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
