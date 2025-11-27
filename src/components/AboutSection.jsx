import { Container, Row, Col, Button } from "react-bootstrap";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function AboutSection() {

  const navigate = useNavigate();
  return (
    <Container fluid className="p-0 m-0">
      <Row className="g-0 align-items-stretch">
        {/* Left Image */}
        <Col md={6} className="d-flex">
          <img
            src="/images/about-fh.jpg"
            alt="About FH General Equipment"
            className="w-100 object-fit-cover"
            style={{ height: "100%" }}
          />
        </Col>

        {/* Right Content */}
        <Col
          md={6}
          className="bg-dark text-light d-flex flex-column justify-content-center px-4 px-md-5"
        >
          <h1 className=" mb-4 mt-5  about-title">
            About <span className="text-success">Us</span>
            <br />
            General Equipment
          </h1>
          <p className="text-white-50 mb-4 me-3 p-2" style={{textAlign:"start"}}>
            FH General Equipment is a trusted provider of medical, industrial, and general equipment solutions in Guyana, USA. We are committed to delivering reliable, high-quality products that support healthcare institutions, industries, and professional environments. Our focus on quality, innovation, and service excellence ensures that every solution we provide meets international standards. By working closely with our customers, we deliver equipment that enhances safety, efficiency, and long-term performance. With a growing portfolio and a dedication to continuous improvement, we strive to be a dependable partner for organizations seeking durable and high-standard equipment solutions across Guyana and beyond.
          </p>
          <Button
            variant="success"
            className="learn-btn mb-5 custom-btn"
            size="sm"
            style={{ width: "150px" }}
            onClick={() => navigate("/about")}
          >
            Learn More 
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
