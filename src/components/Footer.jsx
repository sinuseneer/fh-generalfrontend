import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../App.css";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import axios from "axios";
import api_uri, { base_uri } from "../config/api";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${api_uri}category/userview`);
        if (res.data && res.data.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        // ignore silently; keep fallback list
        console.error("Error fetching footer categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleContactClick = () => {
    // `setExpanded` is not defined in this component; it causes a runtime
    // ReferenceError when clicking the button. Only navigate to contact here.
    navigate("/contact");
  };

  return (
    <footer className="bg-light text-dark pt-2 pb-0 m-0">
      <Container>
        <Row className="gy-4 my-4">
          {/* Logo */}
          <Col md={3}>
            <div className="mb-4">
              <img
                src="/images/LogoGeneralEquipments.svg"
                alt="General Equipment Logo"
                style={{ width: "160px" }}
              />
            </div>

            <h6 className="fw-bold mb-3 mt-5">Follow Us</h6>
            <div className="d-flex gap-4 align-items-center footer-social-icons">
              <a
                href="https://www.facebook.com/profile.php?id=61584453625741"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-icon"
              >
                <FaFacebookF size={24} />
              </a>

              <a
                href="https://www.instagram.com/fhgeneralequipment/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-icon"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/fh-general-equipment/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-icon"
              >
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2}>
            <h5 className="fw-bold mb-3">Quick Link</h5>
            <ul className="list-unstyled">
              <li className="my-1">
                <a href="/" className="footer-link">
                  Home
                </a>
              </li>
              <li className="my-1">
                <a href="/about" className="footer-link">
                  About Us
                </a>
              </li>
              <li className="my-1">
                <a href="/product" className="footer-link">
                  Products
                </a>
              </li>
              <li className="my-1">
                <a href="/blog" className="footer-link">
                  Blog
                </a>
              </li>
              <li className="my-1">
                <a href="/contact" className="footer-link">
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>

          {/* Products / Categories */}
          <Col md={4}>
            <h5 className="fw-bold mb-3">Categories</h5>
            <Row>
              <Col xs={6}>
                <ul className="list-unstyled">
                  {loading ? (
                    <li className="my-1">Loading...</li>
                  ) : categories && categories.length > 0 ? (
                    categories
                      .slice(0, Math.ceil(categories.length / 2))
                      .map((cat) => (
                        <li key={cat._id} className="my-1">
                          <a
                            href={`/product?category=${encodeURIComponent(
                              cat.category_name,
                            )}`}
                            className="footer-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/product", {
                                state: { category: cat.category_name },
                              });
                            }}
                          >
                            {cat.category_name}
                          </a>
                        </li>
                      ))
                  ) : (
                    // Fallback static list if API empty / fails
                    <>
                      <li className="my-1">Hospital Bed</li>
                      <li className="my-1">Exam Table</li>
                    </>
                  )}
                </ul>
              </Col>
              <Col xs={6}>
                <ul className="list-unstyled">
                  {loading ? (
                    <li className="my-1">&nbsp;</li>
                  ) : categories && categories.length > 0 ? (
                    categories
                      .slice(Math.ceil(categories.length / 2))
                      .map((cat) => (
                        <li key={cat._id} className="my-1">
                          <a
                            href={`/product?category=${encodeURIComponent(
                              cat.category_name,
                            )}`}
                            className="footer-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/product", {
                                state: { category: cat.category_name },
                              });
                            }}
                          >
                            {cat.category_name}
                          </a>
                        </li>
                      ))
                  ) : (
                    <>
                      <li className="my-1">Operation Table</li>
                      <li className="my-1">Operation Lamp</li>
                    </>
                  )}
                </ul>
              </Col>
            </Row>
          </Col>

          {/* Contact */}
          <Col md={3}>
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <p className="mb-2">
              <a
                href="https://wa.me/5926431452"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center footer-link"
              >
                <FiPhone className="me-2" />
                +592 643 1452
              </a>
            </p>
            <p className="mb-2">
              <a
                href="mailto:info@fhgeneralequipment.com"
                className="d-flex align-items-center footer-link"
              >
                <FiMail className="me-2" />
                info@fhgeneralequipment.com
              </a>
            </p>
            <p className="mb-2">
              <FiMapPin className="me-2" />
              Lot 4 Bel Air, Georgetown Guyana, South America
            </p>
            <Button
              className="rounded-1 mt-3 custom-btn px-4 py-2"
              onClick={handleContactClick}
            >
              Get in Touch
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Copyright Section */}
      <div className="footer-copyright-section">
        <Container>
          <Row className="py-3">
            <Col md={6} className="text-center text-md-start">
              © {new Date().getFullYear()} FH General Equipment. All Rights
              Reserved.
            </Col>
            <Col md={6} className="text-center text-md-end">
              Designed and developed by{" "}
              <a
                href="https://blueweb2.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-dev-link"
              >
                Blueweb2.com
              </a>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}
