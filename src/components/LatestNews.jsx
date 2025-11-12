import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const LatestNews = () => {
 const newsItems = [
    {
      date: "DEC 24 2024",
      title: "Simple and natural ways to strengthen your immune system",
      image: `/images/newsimg1 (1).svg`,
    },
    {
      date: "DEC 24 2024",
      title: "Why regular checkups and proactive measures are vital for health",
      image: `/images/newsimg2.png`,
    },
    {
      date: "DEC 24 2024",
      title: "Simple strategies to maintain your health and wellness every day",
      image: `/images/newsimg3.png`,
    },
    {
      date: "DEC 24 2024",
      title: "Essential information for women to stay healthy and active at any age",
      image: `/images/newsimg4.png`,
    },
  ];

  return (
    <Container fluid className="py-5 bg-light latest-news-section">
      <Container>
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 className="fw-bold mb-2">Blogs</h2>
            <p className="text-muted mb-0">
              Discover our Feature products designed to fuel your fitness journey.
            </p>
          </div>
          {/* <Button
            variant="dark"
            className="mt-3 mt-md-0 px-4 py-2 fw-semibold rounded-3"
          >
            VIEW ALL ARTICLES
          </Button> */}
        </div>

        {/* News Cards */}
        <Row className="g-4">
          {newsItems.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0 rounded-4">
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt={item.title}
                  className="rounded-top-4"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body className="text-start">
                  <small className="text-muted mb-2">{item.date}</small>
                  <Card.Title className="fs-6 fw-semibold">{item.title}</Card.Title>
                  <a href="#" className="text-success fw-semibold small">
                    Read More
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default LatestNews;
