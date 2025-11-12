import React, { useState } from "react";
import axios from "axios";
import api_uri from "../../config/api";
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentUsername: "",
    newUsername: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentUsername) {
      toast.warning("Enter your current username");
      return;
    }

    try {
  const res = await axios.post(`${api_uri}admin/update`, formData);

      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ currentUsername: "", newUsername: "", newPassword: "" });

        // Optional: redirect to login page after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card
        className="p-4 shadow-lg border-0"
        style={{
          backgroundColor: "#1c1e22",
          color: "#e4e6eb",
          borderRadius: "15px",
        }}
      >
        <h4 className="text-center mb-4 fw-semibold">Account Settings</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Current Username</Form.Label>
            <Form.Control
              type="text"
              name="currentUsername"
              value={formData.currentUsername}
              onChange={handleChange}
              placeholder="Enter current username"
              className="bg-dark text-light border-0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-light">New Username</Form.Label>
            <Form.Control
              type="text"
              name="newUsername"
              value={formData.newUsername}
              onChange={handleChange}
              placeholder="Enter new username"
              className="bg-dark text-light border-0"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-light">New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="bg-dark text-light border-0"
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 fw-semibold"
            style={{
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Update Account
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AccountSettings;
