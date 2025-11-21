import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api_uri from "../../config/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${api_uri}admin/login`, formData);

      if (res.data.success) {
        const { token, admin } = res.data;

        // ⭐ Save token + expiry
        const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_expiry", expiresAt);
        localStorage.setItem("admin_info", JSON.stringify(admin));

        navigate("/admin/dashboard");
      } else {
        setError(res.data.message || "Invalid username or password");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #000000 0%, #1f1f1f 50%, #3a3a3a 100%)",
        color: "#fff",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#121212",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 2, color: "#fff", fontWeight: "bold" }}
        >
          Admin Login
        </Typography>

        {error && (
          <Typography align="center" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            required
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{
              style: { color: "#fff" },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{
              style: { color: "#fff" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#125ea3" },
            }}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
