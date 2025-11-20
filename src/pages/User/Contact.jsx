import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { MapPin, Phone, Mail, User } from "lucide-react";
import emailjs from "emailjs-com";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import "./product.css";

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

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    try {
      // Send to admin
      await emailjs.send(
        "service_lk58uuc",
        "template_rbjt40m",
        templateParams,
        "Gc1PPygtgpQKGULIe"
      );

      toast.dismiss(toastId);
      toast.success("✅ Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.dismiss(toastId);
      console.error("❌ Email send failed:", error);
      toast.error("⚠️ Failed to send message. Please try again.");
    }
  };

  const contactDetails = [
    {
      icon: <MapPin size={40} color="#fff" />,
      title: "Address",
      text: "Lot 4 Bel Air, Georgetown Guyana, South America",
    },
    {
      icon: <Phone size={40} color="#fff" />,
      title: "Phone Number",
      text: "+1 347 860 4095",
    },
    {
      icon: <Mail size={40} color="#fff" />,
      title: "E-mail",
      text: "info@fhgeneralequipment.com",
    },
  ];

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header text-center py-5">
        <h2 className="fw-bold">Contact Us</h2>
      </div>

      {/* CONTACT INFO + GET IN TOUCH (2 COLUMNS) */}
      <Container className="py-5">
        <Row className="g-4 align-items-start">
          {/* Left Column – Contact Cards */}
          <Col md={6}>
            <Row className="g-4">
              {contactDetails.map((item, index) => (
                <Col md={12} key={index}>
  <Card className="contact-card horizontal border-1 p-4">
  <div className="icon-box">
    {item.icon}
  </div>

  <div className="contact-content ms-3">
    <h5 className="fw-bold mb-1">{item.title}</h5>
    <p className="text-muted mb-0">{item.text}</p>
  </div>
</Card>


                </Col>
              ))}
            </Row>
          </Col>

          {/* Right Column – Contact Form */}
          <Col md={6}>
            <div className="p-4 rounded-4 bg-light shadow-sm">
              <h3 className="fw-bolder mb-3">Get In Touch</h3>
              <p className="text-muted mb-4">
                Your email address is safe with us.
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 position-relative">
                  <User
                    className="position-absolute text-muted"
                    style={{
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
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
                    style={{ paddingLeft: "40px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Mail
                    className="position-absolute text-muted"
                    style={{
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
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
                    style={{ paddingLeft: "40px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Phone
                    className="position-absolute text-muted"
                    style={{
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
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
                    style={{ paddingLeft: "40px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={4}
                    placeholder="Write Your Message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="dark"
                  type="submit"
                  className="px-4 py-2 rounded-3 custom-btn"
                  style={{ fontSize: "12px" }}
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
  );
}
