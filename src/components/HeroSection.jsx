import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { api_uri, base_uri } from "../config/api";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const autoplayRef = useRef(null);
  const isFirstRender = useRef(true);
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
        textMode: b.textMode || "dark",
        desktop: b.image ? `${base_uri}${b.image}` : null,
        mobile: b.mobileImage ? `${base_uri}${b.mobileImage}` : null,
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
     First Render Flag
  ----------------------------------------- */
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  /* ----------------------------------------
     Reset image animation per slide
  ----------------------------------------- */
  useEffect(() => {
    setImageLoaded(false);
  }, [current]);

  /* ----------------------------------------
     Detect Mobile Safely
  ----------------------------------------- */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ----------------------------------------
     Preload First Hero Image (LCP)
  ----------------------------------------- */
  useEffect(() => {
    if (!slides.length) return;

    const firstImage = isMobile
      ? slides[0].mobile || slides[0].desktop
      : slides[0].desktop || slides[0].mobile;

    if (!firstImage) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = firstImage;

    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, [slides, isMobile]);

  /* ----------------------------------------
     Autoplay Logic
  ----------------------------------------- */
  useEffect(() => {
    if (!isFirstRender.current && slides.length > 1) {
      startAutoplay();
    }
    return stopAutoplay;
  }, [slides]);

  function startAutoplay() {
    stopAutoplay();
    autoplayRef.current = setInterval(handleNext, 5200);
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

    setTimeout(() => setIsTransitioning(false), ANIM_DURATION + 40);
  };

  const handlePrev = () => {
    if (isTransitioning || slides.length <= 1) return;

    setDirection("prev");
    setIsTransitioning(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    setTimeout(() => setIsTransitioning(false), ANIM_DURATION + 40);
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
    const isActive =
      i === current && (!isTransitioning || isFirstRender.current);

    const oldIndex =
      direction === "next"
        ? (current - 1 + slides.length) % slides.length
        : (current + 1) % slides.length;

    const isOldSlide = isTransitioning && i === oldIndex;
    const isIncoming = isTransitioning && isActive;

    return [
      "carousel-slide",
      isActive && "active",
      isIncoming && direction,
      isOldSlide && (direction === "next" ? "prev" : "next"),
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
        aria-label="Hero banner carousel"
        aria-live="polite"
      >
        <div className="carousel-slides">
          {slides.map((s, i) => {
            const cls = getSlideClass(i);
            const img = isMobile ? s.mobile || s.desktop : s.desktop || s.mobile;

            return (
              <div key={s.id} className={cls}>
                {i === current ? (
                  <img
                    src={img}
                    alt={s.title || "Hero banner"}
                    className={`slide-image-img ${
                      imageLoaded ? "loaded" : ""
                    }`}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                  />
                ) : (
                  <div
                    className="slide-image"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                )}

                <div className="slide-overlay" />

                <div className="slide-content">
                  <div className="slide-text-wrapper">
                    <h1
                      className="slide-title"
                      style={{
                        color:
                          s.textMode === "light" ? "#ffffff" : "#000000",
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
                  className={`carousel-dot ${
                    idx === current ? "active" : ""
                  }`}
                  onClick={() => !isTransitioning && setCurrent(idx)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
