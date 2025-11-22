import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import api_uri, { base_uri } from "../config/api";
import { Container } from "react-bootstrap";
import "./ProductCarousel.css";
import "../App.css";
import { useNavigate } from "react-router-dom";

// Custom Mobile Slider Component for Categories
const CustomMobileCategorySlider = ({ categories, navigate }) => {
  return (
    <div className="custom-mobile-category-slider">
      <div className="category-slider-container">
        <div className="category-slider-track">
          {categories.map((cat) => (
            <div key={cat._id} className="mobile-category-slide">
              <div
                className="product-card"
                onClick={() =>
                  navigate("/product", { state: { category: cat.category_name } })
                }
                style={{ cursor: "pointer" }}
              >
                <div className="image-wrapper">
                  <img
                    src={
                      cat.category_image
                        ? `${base_uri}${cat.category_image}`
                        : "/images/no-image.jpg"
                    }
                    alt={cat.category_name}
                    loading="lazy"
                  />
                </div>
                <h3 className="product-title">{cat.category_name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProductCarousel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      { 
        breakpoint: 1200, 
        settings: { 
          slidesToShow: 5,
          slidesToScroll: 1,
        } 
      },
      { 
        breakpoint: 992, 
        settings: { 
          slidesToShow: 3,
          slidesToScroll: 1,
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        } 
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          swipeToSlide: true,
          centerMode: false,
          variableWidth: false,
        },
      },
    ],
  };

  // ✅ Fetch categories from backend
 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${api_uri}category/userview`);

      if (res.data.success) {
        const sorted = (res.data.categories || []).sort(
          (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
        );

        setCategories(sorted);
        console.log("✅ Categories Loaded:", sorted);
      }
    } catch (error) {
      console.error("❌ Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, []);


  return (
    <div className="product-carousel-section mt-2 mb-1">
      <Container style={{ paddingRight: 0 }}>
        <div className="mb-4">
          <h2 className="fw-bold text-start">Categories</h2>
        </div>

        {loading ? (
          <p className="text-center">Loading categories...</p>
        ) : categories.length > 0 ? (
          // Conditional Rendering: Custom Mobile Slider or Slick Slider
          isMobile ? (
            <CustomMobileCategorySlider categories={categories} navigate={navigate} />
          ) : (
            <Slider {...settings}>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="product-card"
                  onClick={() =>
                    navigate("/product", { state: { category: cat.category_name } })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="image-wrapper">
                    <img
                      src={
                        cat.category_image
                          ? `${base_uri}${cat.category_image}`
                          : "/images/no-image.jpg"
                      }
                      alt={cat.category_name}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="product-title">{cat.category_name}</h3>
                </div>
              ))}
            </Slider>
          )
        ) : (
          <p className="text-center">No categories found.</p>
        )}
      </Container>
    </div>
  );
}
