import React from "react";
import { Container } from "react-bootstrap";
import "../App.css"; 


export default function Banner() {
  return (
    <div className="banner-section">
      <div className="banner-overlay">
        <Container className="text-center py-5">
          <h1 className="banner-title">Products</h1>
         
        </Container>
      </div>
    </div>
  );
}


 