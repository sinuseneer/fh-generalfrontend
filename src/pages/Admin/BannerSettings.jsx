import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_uri, base_uri } from "../../config/api";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { toast } from "react-toastify";

export default function BannerSettings() {
  const [banners, setBanners] = useState([]);

  // Image Inputs
  const [desktopImage, setDesktopImage] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);

  const [mobileImage, setMobileImage] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);

  // Shared Text
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // Text mode toggle (true = light text, false = dark text)
  const [lightText, setLightText] = useState(false);

  const [loading, setLoading] = useState(false);

  // Fetch banners
  const fetchBanners = () => {
    axios
      .get(`${api_uri}banners`)
      .then((res) => setBanners(res.data))
      .catch(() => toast.error("Failed to load banners"));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Desktop image preview
  function handleDesktopChange(e) {
    const f = e.target.files[0];
    if (f) {
      setDesktopImage(f);
      setDesktopPreview(URL.createObjectURL(f));
    }
  }

  // Mobile image preview
  function handleMobileChange(e) {
    const f = e.target.files[0];
    if (f) {
      setMobileImage(f);
      setMobilePreview(URL.createObjectURL(f));
    }
  }

  // Upload banner
  async function handleUpload(e) {
    e.preventDefault();

    if (!desktopImage) return toast.warning("Please upload desktop image");
    if (!mobileImage) return toast.warning("Please upload mobile image");

    const formData = new FormData();
    formData.append("desktopImage", desktopImage);
    formData.append("mobileImage", mobileImage);

    formData.append("title", title);
    formData.append("subtitle", subtitle);

    formData.append("textMode", lightText ? "light" : "dark"); // TEXT MODE ONLY

    setLoading(true);

    try {
      await axios.post(`${api_uri}banners`, formData);
      toast.success("Banner uploaded");

      setDesktopImage(null);
      setMobileImage(null);
      setDesktopPreview(null);
      setMobilePreview(null);
      setTitle("");
      setSubtitle("");
      setLightText(false);

      fetchBanners();
    } catch (error) {
      toast.error("Upload failed");
    }
    setLoading(false);
  }

  return (
    <Box sx={{ p: 3, color: "#fff" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        🖼 Banner Settings
      </Typography>

      {/* ===== UPLOAD FORM ===== */}
      <Box
        component="form"
        onSubmit={handleUpload}
        sx={{
          p: 3,
          mb: 5,
          border: "1px solid #333",
          borderRadius: 2,
          background: "#111",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Banner
        </Typography>

        <Grid container spacing={4}>
          {/* LEFT SIDE (images) */}
          <Grid item xs={12} md={6}>
            {/* Desktop */}
            <Button
              component="label"
              fullWidth
              variant="contained"
              sx={{ background: "#37b24d", mb: 2 }}
            >
              Upload Desktop Image
              <input hidden type="file" accept="image/*" onChange={handleDesktopChange} />
            </Button>

            {desktopPreview && (
              <img
                src={desktopPreview}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              />
            )}

            {/* Mobile */}
            <Button
              component="label"
              fullWidth
              variant="contained"
              sx={{ background: "#6c5ce7", mt: 3, mb: 2 }}
            >
              Upload Mobile Image
              <input hidden type="file" accept="image/*" onChange={handleMobileChange} />
            </Button>

            {mobilePreview && (
              <img
                src={mobilePreview}
                style={{
                  width: 220,
                  height: 400,
                  objectFit: "cover",
                  borderRadius: 8,
                  margin: "auto",
                  display: "block",
                }}
              />
            )}
          </Grid>

          {/* RIGHT SIDE (inputs) */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2, background: "#fff", borderRadius: 1 }}
            />

            <TextField
              fullWidth
              label="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              sx={{ mb: 2, background: "#fff", borderRadius: 1 }}
            />

            {/* TEXT MODE TOGGLE */}
            <FormControlLabel
              control={
                <Switch
                  checked={lightText}
                  onChange={() => setLightText(!lightText)}
                  color="success"
                />
              }
              label={lightText ? "Light Text" : "Dark Text"}
              sx={{ mt: 2 }}
            />

            {/* Upload button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                background: "#00b894",
                py: 1.2,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {loading ? "Uploading..." : "Upload Banner"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* ===== EXISTING BANNERS ===== */}
      <Grid container spacing={3}>
        {banners.map((b) => (
          <Grid item xs={12} md={4} key={b._id}>
            <Card sx={{ background: "#111", color: "#fff" }}>
              <CardMedia height="200" component="img" image={`${base_uri}${b.image}`} />

              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>{b.title}</Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1 }}
                  color={b.active ? "error" : "success"}
                  onClick={() =>
                    b.active
                      ? axios.put(`${api_uri}banners/${b._id}/deactivate`).then(fetchBanners)
                      : axios.put(`${api_uri}banners/${b._id}/activate`).then(fetchBanners)
                  }
                >
                  {b.active ? "Deactivate" : "Activate"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    window.confirm("Delete banner?") &&
                    axios.delete(`${api_uri}banners/${b._id}`).then(fetchBanners)
                  }
                >
                  Delete
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
