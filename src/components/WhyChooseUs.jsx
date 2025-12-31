import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../App.css";
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const features = [
  {
    img: "/images/frames/quality.svg",
    title: "Innovation",
    desc: "Continuously advance technology and develop cutting-edge products.",
  },
  {
    img: "/images/frames/service.svg",
    title: "Quality",
    desc: "With strict quality control standards, each product is rigorously tested.",
  },
  {
    img: "/images/frames/integrity.svg",
    title: "Service",
    desc: "Provide professional pre-sales consultation and after-sales support.",
  },
  {
    img: "/images/frames/Frame.svg",
    title: "Integrity",
    desc: "Through transparency and fairness in all business transactions.",
  },
];

  return (
    <section className="why-choose-section py-5">
      <Container>
        <h2 className="mb-5 fw-semibold why-choose-title">
          Why Choose Us
        </h2>

        <Row className="g-4 justify-content-center">
          {features.map((item, index) => (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={6}
              lg={3}
              className="d-flex justify-content-center"
            >
              <Card className="text-center border-0 shadow-sm choose-card mt-4">
                <div className="choose-icon mt-2">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="icon-img"
                    
                  />
                </div>
                <Card.Body>
                  <Card.Title className="fw-semibold choose-title pt-0">
                    {item.title}
                  </Card.Title>
                  <Card.Text className="choose-desc">{item.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
