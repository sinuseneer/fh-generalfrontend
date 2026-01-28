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
                  href="tel:+13478694095"
                  className="d-flex align-items-center gap-2 text-decoration-none"
                >
                  <Telephone size={15} />
                  <span>+1 347 869 4095</span>
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
