import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css"; // we'll create this next

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/13478694095?text=Hello,%20I%20am%20interested%20in%20your%20product%20and%20would%20like%20to%20know%20more%20details."
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="bi bi-whatsapp"></i>
    </a>
  );
};

export default WhatsAppButton;
