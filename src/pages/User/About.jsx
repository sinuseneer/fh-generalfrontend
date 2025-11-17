import React, { useState } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import "./About.css";
import WhyChooseUs from "../../components/WhyChooseUs";
import { useNavigate } from "react-router-dom";


export default function About() {
  const [activeTab, setActiveTab] = useState("story");
  const navigate = useNavigate();


  const content = {
    story: {
      title: "About Us",
      text: `
       FH General Equipment is a trusted provider of medical, industrial, and general equipment solutions in Guyana, USA. We are committed to delivering reliable, high-quality products that support healthcare institutions, industries, and professional environments. Our focus on quality, innovation, and service excellence ensures that every solution we provide meets international standards. By working closely with our customers, we deliver equipment that enhances safety, efficiency, and long-term performance. With a growing portfolio and a dedication to continuous improvement, we strive to be a dependable partner for organizations seeking durable and high-standard equipment solutions across Guyana and beyond.
      `,
    },
    mission: {
      title: "Our Mission",
      text: `
        To supply high-quality, dependable equipment solutions that enhance efficiency, safety, and performance across healthcare and industrial sectors. We are dedicated to offering products that meet international standards, ensuring long-term value and reliability for every client. Through strong customer support, continuous improvement, and a commitment to innovation, we aim to empower organizations in Guyana and beyond with equipment that drives better outcomes and sustained operational excellence.
      `,
    },
    vision: {
      title: "Our Vision",
      text: `
        To become a leading global provider of medical and general equipment solutions, recognized for our unwavering reliability, commitment to innovation, and strong customer trust. We aim to set new standards in quality and service excellence, empowering institutions in Guyana and around the world with equipment that supports growth, safety, and long-term success.
      `,
    },
  };

  return (
    <Container fluid className="about-section py-5">
      <Container>
        <Row className="align-items-center">
          {/* Left Side Image */}
          <Col xs={12} md={6} className="mb-4 mb-md-5">
            <Image
              src="/images/about/about-hero.jpg"
              alt="About image"
              fluid
              rounded
              className="w-64"
            />
          </Col>

          {/* Right Side Content */}
          <Col xs={12} md={6}>
            <div className="tabs mb-3">
              <span
                className={`tab ${activeTab === "story" ? "active" : ""}`}
                onClick={() => setActiveTab("story")}
              >
                ABOUT
              </span>
              <span
                className={`tab ${activeTab === "mission" ? "active" : ""}`}
                onClick={() => setActiveTab("mission")}
              >
                MISSION
              </span>
              <span
                className={`tab ${activeTab === "vision" ? "active" : ""}`}
                onClick={() => setActiveTab("vision")}
              >
                VISION
              </span>
            </div>

            <h3 className="fw-bold mb-1">{content[activeTab].title}</h3>
            <p className="about-text">{content[activeTab].text}</p>
        <Button className="rounded-1 mt-3 custom-btn px-4 py-2" onClick={() => navigate("/contact")}>
              Get in Touch
            </Button>
          </Col>
        </Row>
      </Container>
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
    </Container>
  );
}
