// ✅ All imports must be on top
import React, { useState } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../logo.svg"; // adjust path if needed
import "../App.css";
import "./NavbarCom.css";

export default function NavbarComp() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // close the navbar on link click
  const handleNavClick = () => setExpanded(false);

  // navigate to /contact
  const handleContactClick = () => {
    setExpanded(false);
    navigate("/contact");
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="custom-navbar shadow-sm "
      expanded={expanded}
    >
      <Container className="nav-container ">
        {/* Left: Logo */}
        <Navbar.Brand as={NavLink} to="/" onClick={handleNavClick}>
          <img
            src={logo}
            alt="General Equipment Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle
          aria-controls="navbarScroll"
          className="toggle-btn"
          onClick={() => setExpanded(expanded ? false : true)}
        />

        {/* Center: Navigation Links */}
        <Navbar.Collapse id="navbarScroll" className="justify-content-center">
          {/* ✅ Header row for mobile: logo + close button */}
          <div className="mobile-header d-lg-none">
            <img src={logo} alt="Logo" className="mobile-logo" />
            <button className="close-btn" onClick={() => setExpanded(false)}>
              &times;
            </button>
          </div>

          <ul className="navbar-nav custom-nav-links">
            <li>
              <NavLink to="/" end onClick={handleNavClick}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={handleNavClick}>
                ABOUT US
              </NavLink>
            </li>
            <li>
              <NavLink to="/product" onClick={handleNavClick}>
                PRODUCT
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog" onClick={handleNavClick}>
                BLOG
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={handleNavClick}>
                CONTACT US
              </NavLink>
            </li>
          </ul>

          {/* Button (for small screens) */}
          <div className="d-lg-none">
            <Button
              variant="contained"
              className="mui-btn"
              onClick={handleContactClick}
            >
              Get in Touch
            </Button>
          </div>
        </Navbar.Collapse>

        {/* Button (for large screens) */}
        <div className="d-none d-lg-block">
          <Button
            variant="contained"
            className="mui-btn"
            onClick={handleContactClick}
          >
            Get in Touch
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}
