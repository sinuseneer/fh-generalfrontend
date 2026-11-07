import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { api_uri } from "../config/api";
import { getImageUrl } from "../utils/imageUrl";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const autoplayRef = useRef(null);
  const navigate = useNavigate();

  const ANIM_DURATION = 900;

  /* ----------------------------------------
     Fetch Slides
  ----------------------------------------- */
  const fetchSlides = useCallback(async () => {
    try {
      const res = await axios.get(`${api_uri}banners/active?sort=order`);

      const formatted = (res.data || []).map((b) => ({
        id: b._id,
        title: b.title || "",
        subtitle: b.subtitle || "",
        textMode: b.textMode || "dark", // ⭐ IMPORTANT
        desktop: getImageUrl(b.image) || null,
        mobile: getImageUrl(b.mobileImage) || null,
      }));

      setSlides(formatted);
      setCurrent(0);
    } catch (err) {
      console.error("Failed to load banners", err);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  /* ----------------------------------------
     Autoplay Logic
  ----------------------------------------- */
  useEffect(() => {
    if (slides.length > 1) startAutoplay();
    return stopAutoplay;
  }, [slides]);

  function startAutoplay() {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      handleNext();
    }, 5200);
  }

  function stopAutoplay() {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }

  /* ----------------------------------------
     Navigation
  ----------------------------------------- */
  const handleNext = () => {
    if (isTransitioning || slides.length <= 1) return;

    setDirection("next");
    setIsTransitioning(true);

    setCurrent((prev) => (prev + 1) % slides.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, ANIM_DURATION + 40);
  };

  const handlePrev = () => {
    if (isTransitioning || slides.length <= 1) return;

    setDirection("prev");
    setIsTransitioning(true);

    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, ANIM_DURATION + 40);
  };

  /* ----------------------------------------
     Keyboard Navigation
  ----------------------------------------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ----------------------------------------
     Touch Swipe Navigation
  ----------------------------------------- */
  const startX = useRef(0);
  const deltaX = useRef(0);

  const onTouchStart = (e) => {
    stopAutoplay();
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const onTouchMove = (e) => {
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const onTouchEnd = () => {
    startAutoplay();
    if (deltaX.current > 60) handlePrev();
    else if (deltaX.current < -60) handleNext();
  };

  /* ----------------------------------------
     Animation Class Logic
  ----------------------------------------- */
  const getSlideClass = (i) => {
    const isActive = i === current;

    const oldIndex =
      direction === "next"
        ? (current - 1 + slides.length) % slides.length
        : (current + 1) % slides.length;

    const isOldSlide = isTransitioning && i === oldIndex;
    const isIncoming = isTransitioning && isActive;

    return [
      "carousel-slide",
      isActive ? "active" : "",
      isIncoming ? direction : "",
      isOldSlide ? (direction === "next" ? "prev" : "next") : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <Container fluid className="p-0 custom-hero-wrapper">
      <div
        className="custom-carousel"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
      >
        <div className="carousel-slides">
          {slides.map((s, i) => {
            const cls = getSlideClass(i);

            const img =
              typeof window !== "undefined" && window.innerWidth <= 768
                ? s.mobile || s.desktop
                : s.desktop || s.mobile;

            return (
              <div key={i} className={cls}>
                <div
                  className="slide-image"
                  style={{
                    backgroundImage: img ? `url("${img}")` : "none",
                  }}
                />

                <div className="slide-overlay" />

                <div className="slide-content">
                  <div className="slide-text-wrapper">
                    
                    {/* ⭐ Text Mode Applied */}
                    <h1
                      className="slide-title"
                      style={{
                        color: s.textMode === "light" ? "#ffffff" : "#000000",
                        textShadow:
                          s.textMode === "light"
                            ? "0 1px 4px rgba(0,0,0,0.7)"
                            : "0 1px 4px rgba(255,255,255,0.7)",
                      }}
                    >
                      {s.title}
                    </h1>

                    <p
                      className="slide-subtitle"
                      style={{
                        color:
                          s.textMode === "light"
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(0,0,0,0.9)",
                        textShadow:
                          s.textMode === "light"
                            ? "0 1px 4px rgba(0,0,0,0.7)"
                            : "0 1px 4px rgba(255,255,255,0.7)",
                      }}
                    >
                      {s.subtitle}
                    </p>

                    <button
                      className="learn-more-btn"
                      onClick={() => navigate("/product")}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <div className="carousel-controls-container">
              <button className="carousel-nav" onClick={handlePrev}>
                ‹
              </button>
              <button className="carousel-nav" onClick={handleNext}>
                ›
              </button>
            </div>

            <div className="carousel-indicators">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === current ? "active" : ""}`}
                  onClick={() => !isTransitioning && setCurrent(idx)}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}   