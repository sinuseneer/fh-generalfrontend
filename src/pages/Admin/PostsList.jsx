import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";
import api_uri from "../../config/api";
import { getImageUrl } from "../../utils/imageUrl";


export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [open, setOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await axios.get(`${api_uri}posts`);
    setPosts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ============================
      DELETE POST
  ============================ */
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${api_uri}posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
      window.alert(error.response?.data?.message || "Failed to delete post");
    }
  };

  /* ============================
      OPEN EDIT MODAL
  ============================ */
  const handleEditOpen = (post) => {
    setEditPost({ ...post }); // copy existing data
    setNewImage(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditPost(null);
  };

  /* ============================
      UPDATE POST
  ============================ */
  const updatePost = async () => {
    const formData = new FormData();
    formData.append("title", editPost.title);
    formData.append("shortDescription", editPost.shortDescription);
    formData.append("longDescription", editPost.longDescription);
    formData.append("date", editPost.date);

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await axios.put(`${api_uri}posts/${editPost._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Failed to update post:", error);
      window.alert(error.response?.data?.message || "Failed to update post");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        View Posts
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={4} key={post._id}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="180"
                image={getImageUrl(post.image)}
                alt={post.title}
              />
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {post.date}
                </Typography>

                <Typography variant="h6" mt={1}>
                  {post.title}
                </Typography>

                <Typography variant="body2" mt={1}>
                  {post.shortDescription}
                </Typography>

                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditOpen(post)}
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => deletePost(post._id)}
                    color="error"
                    variant="contained"
                    size="small"
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================================
            EDIT MODAL
      ================================= */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Post</DialogTitle>

        {editPost && (
          <DialogContent dividers>
            <TextField
              label="Title"
              fullWidth
              sx={{ mb: 2 }}
              value={editPost.title}
              onChange={(e) =>
                setEditPost({ ...editPost, title: e.target.value })
              }
            />

            <TextField
              label="Short Description"
              fullWidth
              sx={{ mb: 2 }}
              value={editPost.shortDescription}
              onChange={(e) =>
                setEditPost({ ...editPost, shortDescription: e.target.value })
              }
            />

            <TextField
              label="Long Description"
              fullWidth
              multiline
              rows={5}
              sx={{ mb: 2 }}
              value={editPost.longDescription}
              onChange={(e) =>
                setEditPost({ ...editPost, longDescription: e.target.value })
              }
            />

            <TextField
              label="Date"
              fullWidth
              sx={{ mb: 2 }}
              value={editPost.date}
              onChange={(e) =>
                setEditPost({ ...editPost, date: e.target.value })
              }
            />

            <Typography variant="subtitle1" mt={2}>
              Current Image:
            </Typography>
            <img
              src={getImageUrl(editPost.image)}
              width="100"
              style={{ borderRadius: 8, marginTop: 8 }}
              alt=""
            />

            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </Button>

            {newImage && (
              <Typography sx={{ mt: 1 }}>Selected: {newImage.name}</Typography>
            )}
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={updatePost} variant="contained" color="success">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
