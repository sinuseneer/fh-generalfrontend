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
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

const BannerSettings = () => {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${api_uri}banners`);
      setBanners(res.data);
    } catch (error) {
      toast.error("Failed to load banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Handle image selection + preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // ✅ Upload new banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("subtitle", subtitle);

    try {
      setLoading(true);
      await axios.post(`${api_uri}banners`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Banner uploaded successfully!");
      setFile(null);
      setPreview(null);
      setTitle("");
      setSubtitle("");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to upload banner");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Activate banner
  const handleActivate = async (id) => {
    try {
      const activeCount = banners.filter((b) => b.active).length;
      if (activeCount >= 2) {
        toast.warning("Only 2 banners can be active at a time");
        return;
      }

      await axios.put(`${api_uri}banners/${id}/activate`);
      toast.success("Banner activated!");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to activate banner");
    }
  };

  // ✅ Deactivate banner
  const handleDeactivate = async (id) => {
    try {
      await axios.put(`${api_uri}banners/${id}/deactivate`);
      toast.info("Banner deactivated");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to deactivate banner");
    }
  };

  // ✅ Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`${api_uri}banners/${id}`);
      toast.info("Banner deleted");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        🖼️ Banner Settings
      </Typography>

      {/* ===================== Upload Section ===================== */}
      {/* ===================== Upload Section ===================== */}
<Box
  component="form"
  onSubmit={handleUpload}
  sx={{
    mb: 5,
    p: 4,
    border: "1px solid #2a2a2a",
    borderRadius: 3,
    backgroundColor: "#111",
    boxShadow: "0 0 12px rgba(0,0,0,0.4)",
  }}
>
  <Typography
    variant="h6"
    sx={{
      mb: 3,
      color: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      gap: 1,
      fontWeight: 600,
    }}
  >
    <span style={{ fontSize: "22px" }}>➕</span> Upload New Banner
  </Typography>

  <Grid container spacing={3} alignItems="center">
    {/* Left side - Image Preview */}
    <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
      <Button
        variant="contained"
        component="label"
        sx={{
          backgroundColor: "#37b24d",
          color: "#fff",
          px: 3,
          py: 1.5,
          fontWeight: 600,
          "&:hover": { backgroundColor: "#2f9e44" },
        }}
      >
        Choose Image
        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
      </Button>

      {preview && (
        <Box
          sx={{
            mt: 3,
            border: "1px solid #333",
            borderRadius: 2,
            overflow: "hidden",
            width: "100%",
            maxWidth: "280px",
            mx: "auto",
          }}
        >
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </Box>
      )}
    </Grid>

    {/* Right side - Inputs */}
    <Grid item xs={12} md={8}>
      <TextField
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1c1c1c",
            color: "#f5f5f5",
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#37b24d" },
            "&.Mui-focused fieldset": { borderColor: "#37b24d" },
          },
          "& .MuiInputLabel-root": { color: "#bbb" },
        }}
      />

      <TextField
        label="Subtitle"
        variant="outlined"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        fullWidth
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1c1c1c",
            color: "#f5f5f5",
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#37b24d" },
            "&.Mui-focused fieldset": { borderColor: "#37b24d" },
          },
          "& .MuiInputLabel-root": { color: "#bbb" },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          backgroundColor: "#00b894",
          fontWeight: 600,
          fontSize: "16px",
          px: 4,
          py: 1.5,
          width: "100%",
          "&:hover": { backgroundColor: "#009e7e" },
        }}
      >
        {loading ? "Uploading..." : "Upload Banner"}
      </Button>
    </Grid>
  </Grid>
</Box>


      {/* ===================== Banner List ===================== */}
      <Grid container spacing={3}>
        {banners.map((banner) => (
          <Grid item xs={12} sm={6} md={4} key={banner._id}>
            <Card
              sx={{
                border: banner.active ? "3px solid #37b24d" : "1px solid #333",
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`${base_uri}${banner.image}`}
                alt="Banner"
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {banner.title || "Untitled Banner"}
                </Typography>
                <Button
                  variant="contained"
                  color={banner.active ? "error" : "success"}
                  fullWidth
                  sx={{ mb: 1 }}
                  onClick={() =>
                    banner.active
                      ? handleDeactivate(banner._id)
                      : handleActivate(banner._id)
                  }
                >
                  {banner.active ? "Deactivate" : "Set Active"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => handleDelete(banner._id)}
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
};

export default BannerSettings;
