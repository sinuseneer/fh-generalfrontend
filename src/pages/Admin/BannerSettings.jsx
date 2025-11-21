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
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default function BannerSettings() {
  const [banners, setBanners] = useState([]);

  // New banner upload inputs
  const [desktopImage, setDesktopImage] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [lightText, setLightText] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit state
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editMode, setEditMode] = useState("dark");
  const [editDesktopFile, setEditDesktopFile] = useState(null);
  const [editDesktopPreview, setEditDesktopPreview] = useState(null);
  const [editMobileFile, setEditMobileFile] = useState(null);
  const [editMobilePreview, setEditMobilePreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${api_uri}banners`);
      // sort by order (if provided) so UI uses persisted order
      const sorted = Array.isArray(res.data)
        ? res.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [];
      setBanners(sorted);
    } catch (err) {
      toast.error("Failed to load banners");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handlers for new upload previews
  function handleDesktopChange(e) {
    const f = e.target.files[0];
    if (f) {
      setDesktopImage(f);
      setDesktopPreview(URL.createObjectURL(f));
    }
  }

  function handleMobileChange(e) {
    const f = e.target.files[0];
    if (f) {
      setMobileImage(f);
      setMobilePreview(URL.createObjectURL(f));
    }
  }

  // Upload new banner
  async function handleUpload(e) {
    e.preventDefault();
    if (!desktopImage) return toast.warning("Please upload desktop image");
    if (!mobileImage) return toast.warning("Please upload mobile image");

    const formData = new FormData();
    formData.append("desktopImage", desktopImage);
    formData.append("mobileImage", mobileImage);
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("textMode", lightText ? "light" : "dark");

    setLoading(true);
    try {
      await axios.post(`${api_uri}banners`, formData);
      toast.success("Banner uploaded");
      // reset
      setDesktopImage(null);
      setMobileImage(null);
      setDesktopPreview(null);
      setMobilePreview(null);
      setTitle("");
      setSubtitle("");
      setLightText(false);
      fetchBanners();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
    setLoading(false);
  }

  // Start editing: initialize edit state from banner
  const startEditing = (b) => {
    setEditing(b._id);
    setEditTitle(b.title || "");
    setEditSubtitle(b.subtitle || "");
    setEditMode(b.textMode || "dark");
    setEditDesktopFile(null);
    setEditDesktopPreview(null);
    setEditMobileFile(null);
    setEditMobilePreview(null);
  };

  // Edit file handlers
  const handleEditDesktopChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setEditDesktopFile(f);
      setEditDesktopPreview(URL.createObjectURL(f));
    }
  };

  const handleEditMobileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setEditMobileFile(f);
      setEditMobilePreview(URL.createObjectURL(f));
    }
  };

  // Update banner
  const updateBanner = async (id) => {
    const formData = new FormData();
    if (editTitle !== undefined) formData.append("title", editTitle);
    if (editSubtitle !== undefined) formData.append("subtitle", editSubtitle);
    if (editMode) formData.append("textMode", editMode);
    if (editDesktopFile) formData.append("desktopImage", editDesktopFile);
    if (editMobileFile) formData.append("mobileImage", editMobileFile);

    setSavingEdit(true);
    try {
      await axios.put(`${api_uri}banners/${id}`, formData);
      toast.success("Banner updated");
      setEditing(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
    setSavingEdit(false);
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Delete banner?")) return;
    try {
      await axios.delete(`${api_uri}banners/${id}`);
      toast.success("Deleted");
      fetchBanners();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Activate / Deactivate
  const toggleActive = async (b) => {
    try {
      if (b.active) {
        await axios.put(`${api_uri}banners/${b._id}/deactivate`);
        toast.info("Deactivated");
      } else {
        await axios.put(`${api_uri}banners/${b._id}/activate`);
        toast.success("Activated");
      }
      fetchBanners();
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  // Drag & Drop reorder save
  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const reordered = Array.from(banners);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    setBanners(reordered);

    // Save new order (array of ids)
    try {
      const orderedIDs = reordered.map((x) => x._id);
      await axios.put(`${api_uri}banners/reorder`, { order: orderedIDs });
      toast.success("Order saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order");
    }
  };

  return (
    <Box sx={{ p: 3, color: "#fff" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        🖼 Banner Settings
      </Typography>

      {/* UPLOAD FORM */}
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
          <Grid item xs={12} md={6}>
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
                alt="desktop preview"
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              />
            )}

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
                alt="mobile preview"
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

            <FormControlLabel
              control={
                <Switch
                  checked={lightText}
                  onChange={() => setLightText((s) => !s)}
                  color="success"
                />
              }
              label={lightText ? "Light Text" : "Dark Text"}
              sx={{ mt: 2 }}
            />

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

      {/* DRAG & DROP LIST */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="banners-droppable">
          {(provided) => (
            <Grid
              container
              spacing={3}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {banners.map((b, idx) => (
                <Draggable key={b._id} draggableId={b._id} index={idx}>
                  {(prov, snapshot) => (
                    <Grid
                      item
                      xs={12}
                      md={4}
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      // drag handle applied to header area/icon
                    >
                      <Card
                        sx={{
                          background: "#111",
                          color: "#fff",
                          p: 1,
                          border:
                            snapshot.isDragging ? "1px dashed rgba(255,255,255,0.12)" : "none",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", px: 1, pt: 0.5 }}>
                          <Box {...prov.dragHandleProps} sx={{ mr: 1, cursor: "grab" }}>
                            <DragIndicatorIcon />
                          </Box>

                          <Typography sx={{ fontWeight: 600, flex: 1 }}>
                            {b.title || "Untitled"}
                          </Typography>

                          <IconButton size="small" onClick={() => startEditing(b)} title="Edit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Desktop Preview */}
                        <CardMedia
                          height="180"
                          component="img"
                          image={`${base_uri}${b.image}`}
                          alt="Desktop banner"
                        />

                        {/* Mobile Preview (small) */}
                        <CardMedia
                          sx={{ mt: 1 }}
                          height="140"
                          component="img"
                          image={`${base_uri}${b.mobileImage}`}
                          alt="Mobile banner"
                        />

                        <Box sx={{ p: 2 }}>
                          <Typography sx={{ fontWeight: 600 }}>{b.title}</Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}>
                            {b.subtitle}
                          </Typography>

                          <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                            color={b.active ? "error" : "success"}
                            onClick={() => toggleActive(b)}
                          >
                            {b.active ? "Deactivate" : "Activate"}
                          </Button>

                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            sx={{ mt: 1 }}
                            onClick={() => handleDelete(b._id)}
                          >
                            Delete
                          </Button>

                          {/* EDIT SECTION (inline) */}
                          {editing === b._id && (
                            <Box sx={{ mt: 2, borderTop: "1px solid #333", pt: 2 }}>
                              <TextField
                                fullWidth
                                label="Title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                sx={{ mb: 1, background: "#fff", borderRadius: 1 }}
                              />

                              <TextField
                                fullWidth
                                label="Subtitle"
                                value={editSubtitle}
                                onChange={(e) => setEditSubtitle(e.target.value)}
                                sx={{ mb: 1, background: "#fff", borderRadius: 1 }}
                              />

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={editMode === "light"}
                                    onChange={(e) => setEditMode(e.target.checked ? "light" : "dark")}
                                    color="success"
                                  />
                                }
                                label={editMode === "light" ? "Light Text" : "Dark Text"}
                                sx={{ mb: 1 }}
                              />

                              {/* Replace Desktop */}
                              <Button
                                component="label"
                                fullWidth
                                variant="contained"
                                sx={{ background: "#37b24d", my: 1 }}
                              >
                                Replace Desktop Image
                                <input hidden type="file" accept="image/*" onChange={handleEditDesktopChange} />
                              </Button>

                              {editDesktopPreview && (
                                <img
                                  src={editDesktopPreview}
                                  alt="edit desktop preview"
                                  style={{
                                    width: "100%",
                                    height: 160,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                    marginBottom: 8,
                                  }}
                                />
                              )}

                              {/* Replace Mobile */}
                              <Button
                                component="label"
                                fullWidth
                                variant="contained"
                                sx={{ background: "#6c5ce7", my: 1 }}
                              >
                                Replace Mobile Image
                                <input hidden type="file" accept="image/*" onChange={handleEditMobileChange} />
                              </Button>

                              {editMobilePreview && (
                                <img
                                  src={editMobilePreview}
                                  alt="edit mobile preview"
                                  style={{
                                    width: "100%",
                                    height: 160,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                    marginBottom: 8,
                                  }}
                                />
                              )}

                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  startIcon={<SaveIcon />}
                                  fullWidth
                                  variant="contained"
                                  sx={{ background: "#00b894" }}
                                  onClick={() => updateBanner(b._id)}
                                  disabled={savingEdit}
                                >
                                  {savingEdit ? "Saving..." : "Save"}
                                </Button>

                                <Button
                                  startIcon={<CancelIcon />}
                                  fullWidth
                                  variant="outlined"
                                  color="warning"
                                  onClick={() => setEditing(null)}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
