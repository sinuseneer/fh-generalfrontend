import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Envelope, Telephone } from "react-bootstrap-icons";
import "../App.css";
import "./Header.css";

function Header() {
  return (
    <div>
      <div className="header-top py-2">
        <Container>
          <Row className="align-items-center">
            <Col md={6}></Col>

            <Col
              md={6}
              className="contact-info d-flex justify-content-end align-items-center text-white"
            >
              <div className="contact-item">
                <a
                  href="mailto:info@fhgeneralequipment.com"
                  className="d-flex align-items-center gap-2 text-decoration-none"
                >
                  <Envelope size={15} />
                  <span>info@fhgeneralequipment.com</span>
                </a>
              </div>

              <div className="contact-item">
                <a
                  href="https://wa.me/5926431452?text=Hello%20I%20would%20like%20to%20contact%20you"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center gap-2 text-decoration-none"
                >
                  <Telephone size={15} />
                  <span>+592 643 1452</span>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Header;
