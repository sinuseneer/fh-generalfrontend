import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { MapPin, Phone, Mail, User } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import "./product.css";
import api_uri from "../../config/api";
import SEO from "../../components/SEO/SEO";


export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const toastId = toast.info("Sending message...", { autoClose: false });

  const payload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
  };

  try {
    const res = await fetch(`${api_uri}contact/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    toast.dismiss(toastId);

    if (data.success) {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } else {
      toast.error("Failed to send message.");
    }
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Something went wrong!");
  }
};

  const contactDetails = [
    {
      icon: <MapPin size={40} color="#2EA898" />,
      title: "Address",
      text: "Lot 4 Bel Air, Georgetown Guyana, South America",
    },
    {
      icon: <Phone size={40} color="#2EA898" />,
      title: "Phone Number",
      text: "+1 347 869 4095",
    },
    {
      icon: <Mail size={40} color="#2EA898" />,
      title: "E-mail",
      text: "info@fhgeneralequipment.com",
    },
  ];

  return (
  <>
  <SEO
      title="Contact Us | Contact FH General Equipment | Equipment Supplier"
      description="Contact FH General Equipment for medical and industrial equipment inquiries. We serve customers across the United States with operational support in Guyana."
      canonical="https://fhgeneralequipments.com/contact"
    />
      <div className="contact-page">
        {/* Header */}
        <div className="contact-header text-center py-5">
          <h2 className="fw-bold">Contact Us</h2>
        </div>
  
        <Container className="py-4">
          {/* ⭐ Equal Height Row */}
          <Row className="g-4 align-items-stretch">
  
            {/* LEFT COLUMN */}
            <Col md={6} className="h-100">
              <div className="d-flex flex-column gap-4 h-100">
  
                {contactDetails.map((item, index) => (
                  <Card
                    key={index}
                    className="contact-info-card p-5 shadow-sm border-0 rounded-4 flex-grow-1"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    <div
                      className="icon-box"
                      style={{
                        backgroundColor: "#E8FAF6",
                        borderRadius: "12px",
                        padding: "14px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </div>
  
                    <div className="">
                      <h5 className="fw-bold mb-2">{item.title}</h5>
                      <p className="text-start text-muted mb-0 " style={{ lineHeight: "1.5" }}>
                        {item.text}
                      </p>
                    </div>
                  </Card>
                ))}
  
              </div>
            </Col>
  
            {/* RIGHT COLUMN */}
            <Col md={6} className="h-100">
              <div className="p-4 rounded-4 bg-light shadow-sm h-100 d-flex flex-column">
                <h3 className="fw-bolder mb-3">Get In Touch</h3>
                <p className="text-muted mb-4">
                  Your email address is safe with us.
                </p>
  
                <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
  
                  {/* NAME */}
                  <Form.Group className="position-relative">
                    <User
                      className="position-absolute text-muted"
                      style={{
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      size={20}
                    />
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ paddingLeft: "42px" }}
                    />
                  </Form.Group>
  
                  {/* EMAIL */}
                  <Form.Group className="position-relative">
                    <Mail
                      className="position-absolute text-muted"
                      style={{
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      size={20}
                    />
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ paddingLeft: "42px" }}
                    />
                  </Form.Group>
  
                  {/* PHONE */}
                  <Form.Group className="position-relative">
                    <Phone
                      className="position-absolute text-muted"
                      style={{
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      size={20}
                    />
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ paddingLeft: "42px" }}
                    />
                  </Form.Group>
  
                  {/* MESSAGE */}
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={4}
                      placeholder="Write Your Message..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ resize: "none" }}
                    />
                  </Form.Group>
  
                  {/* BUTTON — NOT FULL WIDTH */}
                  <Button
                    variant="dark"
                    type="submit"
                    className="px-4 py-2 rounded-3 mt-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      backgroundColor: "#2EA898",
                      borderColor: "#2EA898",
                      width: "fit-content",
                    }}
                  >
                    Send Message
                  </Button>
  
                  <ToastContainer position="top-center" />
  
                </Form>
              </div>
            </Col>
  
          </Row>
        </Container>
      </div>
  </>
  );
}
