import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api_uri from "../../config/api";

export default function AddPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ FIX HERE — removed date from validation
    if (!title || !shortDescription || !longDescription || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("longDescription", longDescription);
    formData.append("image", image);

    try {
      await axios.post(`${api_uri}posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Post added successfully!");
      navigate("/admin/posts/list");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add post!");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Add New Post
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              fullWidth
              sx={{ mb: 2 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              label="Short Description"
              fullWidth
              sx={{ mb: 2 }}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />

            <TextField
              label="Long Description (HTML Supported)"
              fullWidth
              multiline
              rows={10}
              sx={{ mb: 2 }}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="<p>Write HTML here...</p>"
              slotProps={{
                textarea: {
                  style: {
                    padding: "14px",
                    lineHeight: "1.6",
                  },
                },
              }}
            />

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Button>

            {image && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected: {image.name}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="success" fullWidth>
              Add Post
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
