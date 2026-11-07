import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import api_uri from "../config/api";
import { getImageUrl } from "../utils/imageUrl";
import "../App.css";
import "./LatestNews.css";


const LatestNews = () => {
  const [news, setNews] = useState([]);

  const fetchLatest = async () => {
    try {
      const res = await axios.get(`${api_uri}posts`);

      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const latestFour = sorted.slice(0, 4).map((item) => ({
        ...item,
        image: getImageUrl(item.image),
      }));

      setNews(latestFour);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  return (
    <Container fluid className="py-5 bg-light latest-news-section">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 className="fw-bold mb-2">Blogs</h2>
            <p className="text-muted mb-0">
              Discover our blogs designed to keep you informed and inspired.
            </p>
          </div>
        </div>

        <Row className="g-4">
          {news.map((item, index) => (
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
                  <small className="text-muted mb-2 d-block">
                    {item.date}
                  </small>

                  <Card.Title className="fs-6 fw-semibold">
                    {item.title}
                  </Card.Title>

                  <a
                    href={`/blog/${item._id}`}
                    className="text-success fw-semibold small"
                  >
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
