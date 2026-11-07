import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import api_uri from "../config/api";
import { getImageUrl } from "../utils/imageUrl";
import { Container } from "react-bootstrap";
import "./ProductCarousel.css";
import { useNavigate } from "react-router-dom";

export default function ProductCarousel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  arrows: true,
  slidesToShow: 6,
  responsive: [
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 3,
        arrows: false,
      },
    },
  ],
};


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${api_uri}category/userview`);

        if (res.data.success) {
          const sorted = (res.data.categories || []).sort(
            (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
          );
          setCategories(sorted);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="product-carousel-section">
      <Container>
        <h2 className="carousel-heading">Categories</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Slider {...settings} className="category-slider">
            {categories.map((cat) => (
              <div key={cat._id} className="circle-slide">
                <div
                  className="circle-content"
                  onClick={() =>
                    navigate("/product", {
                      state: { category: cat.category_name },
                    })
                  }
                >
                  <div className="image-wrapper">
                    <img
                      src={
                        cat.category_image
                          ? getImageUrl(cat.category_image)
                          : "/images/no-image.jpg"
                      }
                      alt={cat.category_name}
                    />
                  </div>
                  <p className="circle-title">{cat.category_name}</p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </Container>
    </div>
  );
}
