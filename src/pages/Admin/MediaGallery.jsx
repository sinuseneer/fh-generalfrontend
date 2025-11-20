import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./MediaGallery.css";
import { base_uri } from "../../config/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LIMIT = 40;

// Toast style from your preferred theme
const toastStyle = {
  backgroundColor: "#1a1f1a",
  color: "#c7f9cc",
  border: "1px solid #37b24d",
  borderRadius: "8px",
};

export default function MediaGallery() {
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [selected, setSelected] = useState(null);

  // For multi-select delete
  const [multiSelect, setMultiSelect] = useState([]);

  // Drag area highlight
  const dropRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Load media
  const loadMedia = async (pageNum = 1, reset = false) => {
    setLoading(true);

    const res = await axios.get("/api/media", {
      params: { page: pageNum, limit: LIMIT, search, category },
    });

    if (reset) setMedia(res.data.items);
    else setMedia((prev) => [...prev, ...res.data.items]);

    setTotal(res.data.total);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia(1, true);
    setPage(1);
  }, [search, category]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadMedia(next);
  };

  // -----------------------------
  // UPLOAD (Drag & Drop + normal)
  // -----------------------------
  const uploadFiles = async (files) => {
    const form = new FormData();

    Array.from(files).forEach((file) => {
      form.append("media", file);
    });

    try {
      await axios.post("/api/media/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Uploaded successfully!", { style: toastStyle });
      loadMedia(1, true);
    } catch (err) {
      toast.error("Upload failed", { style: toastStyle });
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) uploadFiles(files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  // -----------------------------
  // MULTI SELECT
  // -----------------------------
  const toggleMultiSelect = (file) => {
    setMultiSelect((prev) =>
      prev.includes(file)
        ? prev.filter((f) => f !== file)
        : [...prev, file]
    );
  };

  const deleteSelectedFiles = async () => {
    if (multiSelect.length === 0) {
      toast.warning("No files selected!", { style: toastStyle });
      return;
    }

    if (!window.confirm(`Delete ${multiSelect.length} files permanently?`))
      return;

    try {
      for (const f of multiSelect) {
        await axios.delete(`/api/media/${f.name}?cat=${f.folder}`);
      }

      toast.success("Deleted selected files", { style: toastStyle });
      setMultiSelect([]);
      loadMedia(1, true);
    } catch (err) {
      toast.error("Failed to delete some files", { style: toastStyle });
    }
  };

  // -----------------------------
  // SAVE META
  // -----------------------------
  const saveMeta = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const payload = {
      title: form.get("title"),
      alt: form.get("alt"),
      caption: form.get("caption"),
      description: form.get("description"),
    };

    try {
      await axios.post(
        `/api/media/meta/${selected.name}?cat=${selected.folder}`,
        payload
      );

      toast.success("Updated successfully!", { style: toastStyle });
      setSelected(null);
      loadMedia(1, true);
    } catch {
      toast.error("Failed to update", { style: toastStyle });
    }
  };

  // -----------------------------
  // DELETE SINGLE
  // -----------------------------
  const deleteFile = async () => {
    if (!window.confirm("Delete this file permanently?")) return;

    try {
      await axios.delete(`/api/media/${selected.name}?cat=${selected.folder}`);
      toast.success("Deleted", { style: toastStyle });
      setSelected(null);
      loadMedia(1, true);
    } catch {
      toast.error("Delete failed", { style: toastStyle });
    }
  };

  return (
    <div className="media-wrapper">

      {/* Toast container */}
      <ToastContainer />

      <h2 className="page-title">Media Library</h2>

      {/* --- Filters & Actions --- */}
      <div className="media-filters">
        <input
          type="text"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Images</option>
          <option value="products">Products</option>
          <option value="posts">Posts</option>
          <option value="banners">Banners</option>
          <option value="categories">Categories</option>
        </select>

        {/* DELETE SELECTED BUTTON */}
        {multiSelect.length > 0 && (
          <button className="btn danger" onClick={deleteSelectedFiles}>
            Delete Selected ({multiSelect.length})
          </button>
        )}

        {/* Upload Button */}
        <input
          type="file"
          multiple
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>

      {/* --- Drag and Drop zone --- */}
      <div
        ref={dropRef}
        className={`drop-area ${dragging ? "drag-active" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        Drag & Drop files here
      </div>

      {/* --- Media Grid --- */}
      <div className="media-grid">
        {media.map((item) => (
          <div
            className={`media-card ${
              multiSelect.includes(item) ? "selected" : ""
            }`}
            key={item.name}
          >
            <img
              src={base_uri + item.url}
              alt={item.meta?.alt || ""}
              onClick={(e) => {
                if (e.shiftKey) toggleMultiSelect(item);
                else setSelected(item);
              }}
            />
          </div>
        ))}
      </div>

      {media.length < total && (
        <div className="load-more-wrap">
          <button className="btn" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}

      {loading && <p style={{ color: "#999", marginTop: 15 }}>Loading...</p>}

      {/* --- Modal --- */}
      {selected && (
        <div className="media-modal">
          <div className="modal-inner">
            <button className="modal-close" onClick={() => setSelected(null)}>
              ✕
            </button>

            <div className="modal-left">
              <img src={base_uri + selected.url} alt="" />

              <div className="modal-actions">
                <a
                  href={base_uri + selected.downloadUrl}
                  className="btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>

                <button className="btn danger" onClick={deleteFile}>
                  Delete Permanently
                </button>
              </div>
            </div>

            <div className="modal-right">
              <form onSubmit={saveMeta}>
                <label>Title</label>
                <input name="title" defaultValue={selected.meta?.title} />

                <label>Alt Text</label>
                <input name="alt" defaultValue={selected.meta?.alt} />

                <label>Caption</label>
                <textarea
                  name="caption"
                  defaultValue={selected.meta?.caption}
                ></textarea>

                <label>Description</label>
                <textarea
                  name="description"
                  defaultValue={selected.meta?.description}
                ></textarea>

                <button className="btn save-btn">Save</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
