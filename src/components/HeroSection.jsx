import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { api_uri, base_uri } from "../config/api";
import "./HeroSection.css";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" or "prev"
  const autoplayRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const ANIM_DURATION = 900; // ms - must match CSS

  // fetch active banners (ensure backend sorts by order)
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

  // autoplay
  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, current]);

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

  // navigation handlers
  const handleGoTo = (index) => {
    if (isTransitioning || index === current || slides.length <= 1) return;
    setDirection(index > current ? "next" : "prev");
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, ANIM_DURATION + 50);
  };

  const handleNext = () => {
    if (isTransitioning || slides.length <= 1) return;
    setDirection("next");
    setIsTransitioning(true);
    setCurrent((s) => (s + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), ANIM_DURATION + 50);
  };

  const handlePrev = () => {
    if (isTransitioning || slides.length <= 1) return;
    setDirection("prev");
    setIsTransitioning(true);
    setCurrent((s) => (s - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), ANIM_DURATION + 50);
  };

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTransitioning, slides.length]);

  // touch/swipe handlers for mobile
  const onTouchStart = (e) => {
    stopAutoplay();
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaX.current = x - touchStartX.current;
  };

  const onTouchEnd = () => {
    startAutoplay();
    const threshold = 60;
    if (touchDeltaX.current > threshold) {
      handlePrev();
    } else if (touchDeltaX.current < -threshold) {
      handleNext();
    }
    touchDeltaX.current = 0;
  };

  // reduced-motion respect: disable animations if user prefers reduced motion
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Container fluid className="p-0 custom-hero-wrapper"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div
        className="custom-carousel"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onTouchStart}
        onPointerMove={onTouchMove}
        onPointerUp={onTouchEnd}
        aria-roledescription="carousel"
      >
        <div className="carousel-slides" role="list">
          {slides.length === 0 && (
            <div className="carousel-slide active">
              <div className="slide-image" style={{ background: "linear-gradient(90deg,#111,#222)" }} />
              <div className="slide-overlay" />
              <div className="slide-content">
                <div className="slide-text-wrapper">
                  <h1 className="slide-title">Welcome</h1>
                  <p className="slide-subtitle">No banners available</p>
                </div>
              </div>
            </div>
          )}

          {slides.map((s, i) => {
            const isActive = i === current;
            const cls = [
              "carousel-slide",
              isActive ? "active" : "",
              isTransitioning && isActive ? direction : "",
            ]
              .filter(Boolean)
              .join(" ");

            // choose image based on screen width (client-only)
            const imageUrl = typeof window !== "undefined" && window.innerWidth <= 768 ? s.mobile || s.desktop : s.desktop || s.mobile;

            return (
              <div
                key={s.id || i}
                role="listitem"
                aria-hidden={!isActive}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
                className={cls}
              >
                <div
                  className={`slide-image ${!prefersReducedMotion ? "slide-image--animated" : ""}`}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                    backgroundColor: !imageUrl ? "#0e0e0e" : undefined,
                  }}
                />
                <div className="slide-overlay" />
                <div className="slide-content">
                  <div className="slide-text-wrapper" style={{ animationDelay: "0.32s" }}>
                    <h2 className="slide-title">{s.title}</h2>
                    <p className="slide-subtitle">{s.subtitle}</p>
                    <button
                      className="learn-more-btn"
                      onClick={() => {
                        // example: could navigate to link if you add link field
                        console.log("Learn more clicked", s);
                      }}
                      aria-label={`Learn more about ${s.title}`}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        {slides.length > 1 && (
          <>
            <div className="carousel-controls-container" aria-hidden="false">
              <button className="carousel-nav carousel-nav-prev" onClick={handlePrev} aria-label="Previous slide">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <button className="carousel-nav carousel-nav-next" onClick={handleNext} aria-label="Next slide">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <div className="carousel-indicators" role="tablist" aria-label="Slide dots">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === current ? "active" : ""}`}
                  onClick={() => handleGoTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-pressed={idx === current}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
