import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Envelope, Telephone } from "react-bootstrap-icons";
import  '../App.css';

function Header() {
  return (
    <div> <div className="header-top py-2">
      <Container>
        <Row className="align-items-center">
          <Col md={6}></Col> {/* Empty left space */}
          <Col
            md={6}
            className="d-flex justify-content-end align-items-center gap-4 text-white"
          >
            <div className="d-flex align-items-center gap-2">
              <Envelope size={16} />
              <span>info@fhgeneralequipment.com</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Telephone size={16} />
              <span>+1 347 869 4095</span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  </div>
  )
}

export default Header