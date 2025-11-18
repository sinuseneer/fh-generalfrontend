import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Pagination } from "react-bootstrap";
import axios from "axios";
import "./Blog.css";

function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8; // You can change to 6, 12, etc.

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(sorted);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Pagination Logic
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container fluid className="blogs-page-wrapper">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 className="fw-bold mb-2">Blogs</h2>
            <p className="text-muted mb-0">
              Discover our Feature products designed to fuel your fitness journey.
            </p>
          </div>
        </div>

        {/* Blog Grid */}
        <Row className="g-4 blogs-grid">
          {currentPosts.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={6} lg={3} className="col">
              <Card className="blog-card">
                <Card.Img variant="top" src={item.image} alt={item.title} />
                <Card.Body className="text-start">
                  <small className="text-muted mb-2">{item.date}</small>
                  <Card.Title>{item.title}</Card.Title>

                  <a href={`/blog/${item._id}`} className="text-success">
                    Read More
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <div className="pagination-wrapper mt-5 d-flex justify-content-center">
          <Pagination>
            {[...Array(totalPages).keys()].map((num) => (
              <Pagination.Item
                key={num + 1}
                active={num + 1 === currentPage}
                onClick={() => handlePageChange(num + 1)}
                className="custom-pagination"
              >
                {num + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </Container>
    </Container>
  );
}

export default BlogsPage;
