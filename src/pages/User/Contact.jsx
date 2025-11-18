<div className="contact-page">
  {/* Header */}
  <div className="contact-header text-center py-5">
    <h2 className="fw-bold">Contact Us</h2>
    <p className="text-muted">Home</p>
  </div>

  {/* 2 Columns in One Row */}
  <Container className="py-5">
    <Row className="g-4 align-items-start">

      {/* Contact Info Cards Column */}
      <Col md={6}>
        <Row className="g-4">
          {contactDetails.map((item, index) => (
            <Col md={12} key={index}>
              <Card className="contact-card border-1 text-center p-4 flex-fill d-flex flex-column justify-content-center">
                <div className="icon-box mx-auto mb-3">{item.icon}</div>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted mb-0">{item.text}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* Get In Touch Form Column */}
      <Col md={6}>
        <div className="p-4 rounded-4 bg-light shadow-sm">
          <h3 className="fw-bolder mb-3">Get In Touch</h3>
          <p className="text-muted mb-4">Your email address is safe with us.</p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 position-relative">
              <User className="position-absolute text-muted"
                style={{ left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }} size={20} />
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
              <Mail className="position-absolute text-muted"
                style={{ left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }} size={20} />
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
              <Phone className="position-absolute text-muted"
                style={{ left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }} size={20} />
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
