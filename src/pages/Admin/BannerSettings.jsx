import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { api_uri, base_uri } from "../../config/api";
import {
  Box,
  Button,
  Typography,
  Grid,
  Avatar,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Tooltip,
  Divider,
  Stack,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

/**
 * BannerSettings (modern admin)
 *
 * Features:
 *  - Row list view for many banners (fast scanning)
 *  - Edit in modal popup
 *  - Add in modal popup
 *  - Drag & drop reorder, save order button
 *  - Activate / Deactivate
 *  - Delete (db-only; backend keeps files)
 *  - Uses backend endpoints as in your project
 *
 * Notes:
 *  - Images are shown using base_uri + stored path
 *  - Backend enforces MAX_ACTIVE; the UI shows errors returned by backend
 */

export default function BannerSettings() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  // Add modal state
  const [openAdd, setOpenAdd] = useState(false);
  const [addDesktopFile, setAddDesktopFile] = useState(null);
  const [addMobileFile, setAddMobileFile] = useState(null);
  const [addDesktopPreview, setAddDesktopPreview] = useState(null);
  const [addMobilePreview, setAddMobilePreview] = useState(null);
  const [addTitle, setAddTitle] = useState("");
  const [addSubtitle, setAddSubtitle] = useState("");
  const [addTextModeLight, setAddTextModeLight] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [editBannerId, setEditBannerId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editTextModeLight, setEditTextModeLight] = useState(false);
  const [editDesktopFile, setEditDesktopFile] = useState(null);
  const [editMobileFile, setEditMobileFile] = useState(null);
  const [editDesktopPreview, setEditDesktopPreview] = useState(null);
  const [editMobilePreview, setEditMobilePreview] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  // Snackbar for friendly messages
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  // Fetch banners
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api_uri}banners`);
      // Sort by order (some records might not have order)
      const sorted = Array.isArray(res.data)
        ? res.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [];
      setBanners(sorted);
    } catch (err) {
      console.error("Failed to load banners:", err);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // ----------------------------
  // Utility helpers
  // ----------------------------
  const previewFromFile = (file) => (file ? URL.createObjectURL(file) : null);

  const baseImage = (path) => (path ? `${base_uri}${path}` : null);

  // ----------------------------
  // Add modal handlers
  // ----------------------------
  const openAddModal = () => setOpenAdd(true);
  const closeAddModal = () => {
    setOpenAdd(false);
    setAddDesktopFile(null);
    setAddMobileFile(null);
    setAddDesktopPreview(null);
    setAddMobilePreview(null);
    setAddTitle("");
    setAddSubtitle("");
    setAddTextModeLight(false);
    setAddLoading(false);
  };

  const onAddDesktopChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setAddDesktopFile(f);
      setAddDesktopPreview(previewFromFile(f));
    }
  };

  const onAddMobileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setAddMobileFile(f);
      setAddMobilePreview(previewFromFile(f));
    }
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    if (!addDesktopFile) return toast.warning("Please upload desktop image");
    if (!addMobileFile) return toast.warning("Please upload mobile image");

    const form = new FormData();
    form.append("desktopImage", addDesktopFile);
    form.append("mobileImage", addMobileFile);
    form.append("title", addTitle);
    form.append("subtitle", addSubtitle);
    form.append("textMode", addTextModeLight ? "light" : "dark");

    setAddLoading(true);
    try {
      await axios.post(`${api_uri}banners`, form);
      toast.success("Banner added");
      closeAddModal();
      fetchBanners();
    } catch (err) {
      console.error("Add failed:", err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setAddLoading(false);
    }
  };

  // ----------------------------
  // Edit modal handlers
  // ----------------------------
  const openEditModal = (b) => {
    setEditBannerId(b._id);
    setEditTitle(b.title || "");
    setEditSubtitle(b.subtitle || "");
    setEditTextModeLight(b.textMode === "light");
    setEditDesktopFile(null);
    setEditMobileFile(null);
    setEditDesktopPreview(null);
    setEditMobilePreview(null);
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setEditBannerId(null);
    setEditTitle("");
    setEditSubtitle("");
    setEditTextModeLight(false);
    setEditDesktopFile(null);
    setEditMobileFile(null);
    setEditDesktopPreview(null);
    setEditMobilePreview(null);
    setEditSaving(false);
  };

  const onEditDesktopChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setEditDesktopFile(f);
      setEditDesktopPreview(previewFromFile(f));
    }
  };

  const onEditMobileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setEditMobileFile(f);
      setEditMobilePreview(previewFromFile(f));
    }
  };

  const submitEdit = async () => {
    if (!editBannerId) return;
    const form = new FormData();
    form.append("title", editTitle);
    form.append("subtitle", editSubtitle);
    form.append("textMode", editTextModeLight ? "light" : "dark");
    if (editDesktopFile) form.append("desktopImage", editDesktopFile);
    if (editMobileFile) form.append("mobileImage", editMobileFile);

    setEditSaving(true);
    try {
      await axios.put(`${api_uri}banners/${editBannerId}`, form);
      toast.success("Banner updated");
      closeEditModal();
      fetchBanners();
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setEditSaving(false);
    }
  };

  // ----------------------------
  // Activate / Deactivate
  // ----------------------------
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
      console.error("Toggle active failed:", err);
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  // ----------------------------
  // Delete (DB only)
  // ----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete banner? This removes it from database only."))
      return;
    try {
      await axios.delete(`${api_uri}banners/${id}`);
      toast.success("Deleted");
      fetchBanners();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  // ----------------------------
  // Reorder (drag & drop)
  // ----------------------------
  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const copy = Array.from(banners);
    const [moved] = copy.splice(source.index, 1);
    copy.splice(destination.index, 0, moved);
    setBanners(copy);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const order = banners.map((b) => b._id);
      await axios.put(`${api_uri}banners/reorder`, { order });
      toast.success("Order saved");
      // re-fetch to ensure server canonical state
      await fetchBanners();
    } catch (err) {
      console.error("Save order failed:", err);
      toast.error(err?.response?.data?.message || "Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  };

  // ----------------------------
  // Lightweight Row renderer (memoized)
  // ----------------------------
  const Row = ({ b, index }) => {
    const preview = b.image ? baseImage(b.image) : addDesktopPreview;
    const mobilePreviewUrl = b.mobileImage ? baseImage(b.mobileImage) : null;

    return (
      <Draggable draggableId={b._id} index={index}>
        {(prov, snapshot) => (
          <ListItem
            ref={prov.innerRef}
            {...prov.draggableProps}
            secondaryAction={
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {/* ACTIVE / INACTIVE BUTTON */}
                <Tooltip title={b.active ? "Deactivate" : "Activate"}>
                  <IconButton onClick={() => toggleActive(b)} size="small">
                    {b.active ? (
                      <CheckCircleIcon sx={{ color: "#4CAF50" }} /> // green
                    ) : (
                      <CancelIcon sx={{ color: "#ff9800" }} /> // orange
                    )}
                  </IconButton>
                </Tooltip>

                {/* EDIT BUTTON */}
                <Tooltip title="Edit">
                  <IconButton onClick={() => openEditModal(b)} size="small">
                    <EditIcon sx={{ color: "#29b6f6" }} /> // blue
                  </IconButton>
                </Tooltip>

                {/* DELETE BUTTON */}
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(b._id)} size="small">
                    <DeleteIcon sx={{ color: "#e53935" }} /> // red
                  </IconButton>
                </Tooltip>
              </Box>
            }
            sx={{
              bgcolor: snapshot.isDragging
                ? "rgba(255,255,255,0.03)"
                : "transparent",
              borderRadius: 1,
              px: 1,
              py: 1,
              alignItems: "flex-start",
            }}
          >
            <ListItemAvatar sx={{ mr: 2, cursor: "grab" }}>
              <Box
                {...prov.dragHandleProps}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: "rgba(255,255,255,0.03)",
                  mr: 1,
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </Box>

              <Avatar
                variant="rounded"
                src={preview}
                sx={{
                  width: 120,
                  height: 72,
                  mr: 1,
                  borderRadius: 1.2,
                  bgcolor: "#222",
                }}
              />
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {b.title || "Untitled"}
                  </Typography>
                  {b.active && (
                    <Chip size="small" label="Active" color="success" />
                  )}
                </Box>
              }
              secondary={
                <>
                  <Typography sx={{ color: "text.secondary" }}>
                    {b.subtitle}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Order: {b.order ?? "-"}
                    </Typography>
                    {mobilePreviewUrl && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Mobile ✓
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Text: {b.textMode === "light" ? "Light" : "Dark"}
                    </Typography>
                  </Stack>
                </>
              }
            />
          </ListItem>
        )}
      </Draggable>
    );
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          🖼 Banner Manager
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddModal}
          >
            Add Banner
          </Button>

          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={saveOrder}
            disabled={savingOrder}
            sx={{ ml: 1 }}
          >
            {savingOrder ? <CircularProgress size={18} /> : "Save Order"}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="banners-list">
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ width: "100%", gap: 1 }}
              >
                {banners.map((b, i) => (
                  <Box key={b._id} sx={{ mb: 1 }}>
                    <Row b={b} index={i} />
                  </Box>
                ))}

                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* -------------------------
          ADD MODAL
         ------------------------- */}
      <Dialog open={openAdd} onClose={closeAddModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Banner
          <IconButton
            aria-label="close"
            onClick={closeAddModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button component="label" variant="contained" fullWidth>
                Upload Desktop Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={onAddDesktopChange}
                />
              </Button>

              {addDesktopPreview && (
                <Box
                  component="img"
                  src={addDesktopPreview}
                  alt="desktop"
                  sx={{ width: "100%", mt: 2, borderRadius: 1 }}
                />
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                component="label"
                variant="contained"
                fullWidth
                color="secondary"
              >
                Upload Mobile Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={onAddMobileChange}
                />
              </Button>

              {addMobilePreview && (
                <Box
                  component="img"
                  src={addMobilePreview}
                  alt="mobile"
                  sx={{ width: "100%", mt: 2, borderRadius: 1 }}
                />
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                fullWidth
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Subtitle"
                fullWidth
                value={addSubtitle}
                onChange={(e) => setAddSubtitle(e.target.value)}
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={addTextModeLight}
                    onChange={() => setAddTextModeLight((s) => !s)}
                  />
                }
                label={
                  addTextModeLight ? "Light Text (white)" : "Dark Text (black)"
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeAddModal}>Cancel</Button>
          <Button onClick={submitAdd} variant="contained" disabled={addLoading}>
            {addLoading ? <CircularProgress size={18} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* -------------------------
          EDIT MODAL
         ------------------------- */}
      <Dialog open={openEdit} onClose={closeEditModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Banner
          <IconButton
            aria-label="close"
            onClick={closeEditModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Current / Replace Desktop Image
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {/* show current server preview if available */}
                {editBannerId && (
                  <Avatar
                    variant="rounded"
                    src={
                      // try to show preview of selected file or fallback to server path
                      editDesktopPreview ||
                      (banners.find((x) => x._id === editBannerId)?.image
                        ? baseImage(
                            banners.find((x) => x._id === editBannerId).image
                          )
                        : null)
                    }
                    alt="desktop"
                    sx={{ width: 200, height: 120, borderRadius: 1 }}
                  />
                )}

                <Box>
                  <Button component="label" variant="contained">
                    Replace Desktop
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={onEditDesktopChange}
                    />
                  </Button>

                  {editDesktopPreview && (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1 }}
                    >
                      New desktop selected
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Current / Replace Mobile Image
              </Typography>

              <Box
                sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}
              >
                {editBannerId && (
                  <Avatar
                    variant="rounded"
                    src={
                      editMobilePreview ||
                      (banners.find((x) => x._id === editBannerId)?.mobileImage
                        ? baseImage(
                            banners.find((x) => x._id === editBannerId)
                              .mobileImage
                          )
                        : null)
                    }
                    alt="mobile"
                    sx={{ width: 160, height: 90, borderRadius: 1 }}
                  />
                )}

                <Box>
                  <Button
                    component="label"
                    variant="contained"
                    color="secondary"
                  >
                    Replace Mobile
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={onEditMobileChange}
                    />
                  </Button>

                  {editMobilePreview && (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1 }}
                    >
                      New mobile selected
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Subtitle"
                fullWidth
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editTextModeLight}
                    onChange={() => setEditTextModeLight((s) => !s)}
                  />
                }
                label={
                  editTextModeLight ? "Light Text (white)" : "Dark Text (black)"
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeEditModal}>Cancel</Button>
          <Button
            onClick={submitEdit}
            variant="contained"
            disabled={editSaving}
          >
            {editSaving ? <CircularProgress size={18} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={snackMsg}
      />
    </Box>
  );
}
