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
            src="/images/Aboutsectionimg.svg"
            alt="About FH General Equipment"
            className="w-100 object-fit-cover"
            style={{ height: "100%" }}
          />
        </Col>

        {/* Right Content */}
        <Col
          md={6}
          className="bg-dark text-light d-flex flex-column justify-content-center px-4"
        >
          <h1 className=" mb-4 mt-5  about-title">
            About <span className="text-success">FH</span>
            <br />
            General Equipment
          </h1>
          <p className="text-white-50 mb-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
          <Button
            variant="success"
            className="learn-btn mb-5"
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
