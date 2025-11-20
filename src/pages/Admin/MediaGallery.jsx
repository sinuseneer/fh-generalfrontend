import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./MediaGallery.css";
import { base_uri } from "../../config/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LIMIT = 40;

const toastStyle = {
  backgroundColor: "#1a1f1a",
  color: "#c7f9cc",
  border: "1px solid #37b24d",
  borderRadius: "8px",
};

const UPLOAD_FOLDERS = [
  { key: "products", label: "Products" },
  { key: "posts", label: "Posts" },
  { key: "banners", label: "Banners" },
  { key: "categories", label: "Categories" },
];

export default function MediaGallery() {
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [uploadFolder, setUploadFolder] = useState("products");

  const [selected, setSelected] = useState(null);
  const [multiSelect, setMultiSelect] = useState([]);
  const [showUnusedOnly, setShowUnusedOnly] = useState(false);

  const dropRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  /* -----------------------------------------
     Load media (with optional usage check)
  ------------------------------------------*/
  const loadMedia = async (pageNum = 1, reset = false) => {
    setLoading(true);

    try {
      const res = await axios.get("/api/media", {
        params: { page: pageNum, limit: LIMIT, search, category },
      });

      let items = res.data.items || [];

      // If the unused-only toggle is on, check usage for each item and keep only unused
      if (showUnusedOnly && items.length > 0) {
        const checks = await Promise.all(
          items.map(async (it) => {
            try {
              const r = await axios.get(
                `/api/media/usage/${encodeURIComponent(it.folder)}/${encodeURIComponent(it.name)}`
              );
              // backend returns object with 'inUse' or lists — normalize to boolean
              const inUse =
                typeof r.data.inUse === "boolean"
                  ? r.data.inUse
                  : // fallback: any arrays returned
                    (Array.isArray(r.data.products) && r.data.products.length > 0) ||
                    (Array.isArray(r.data.product_sub_images) &&
                      r.data.product_sub_images.length > 0) ||
                    (Array.isArray(r.data.categories) && r.data.categories.length > 0) ||
                    (Array.isArray(r.data.posts) && r.data.posts.length > 0) ||
                    (Array.isArray(r.data.banners) && r.data.banners.length > 0);

              return { ...it, inUse };
            } catch (e) {
              // On error assume inUse true (safer)
              return { ...it, inUse: true };
            }
          })
        );

        items = checks.filter((i) => !i.inUse).map((i) => {
          // remove inUse property for rendering consistency
          const { inUse, ...rest } = i;
          return rest;
        });
      }

      if (reset) setMedia(items);
      else setMedia((prev) => [...prev, ...items]);

      setTotal(res.data.total || 0);
    } catch (err) {
      // avoid throwing toast when ToastContainer not ready — but we add it, so safe
      toast.error("Failed to load media", { style: toastStyle });
      console.error("loadMedia error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia(1, true);
    setPage(1);
    setMultiSelect([]);
    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, showUnusedOnly]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadMedia(next);
  };

  /* -----------------------------------------
     UPLOAD
  ------------------------------------------*/
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("media", f));

    try {
      await axios.post(`/api/media/upload?cat=${encodeURIComponent(uploadFolder)}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Uploaded successfully!", { style: toastStyle });
      loadMedia(1, true);
    } catch (err) {
      console.error("uploadFiles error", err);
      toast.error("Upload failed", { style: toastStyle });
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  /* -----------------------------------------
     MULTI SELECT
  ------------------------------------------*/
  const toggleMultiSelect = (file) => {
    setMultiSelect((prev) => {
      const exists = prev.some((f) => f.name === file.name && f.folder === file.folder);
      if (exists) return prev.filter((f) => !(f.name === file.name && f.folder === file.folder));
      return [...prev, file];
    });
  };

  const deleteSelectedFiles = async () => {
    if (multiSelect.length === 0) return;
    if (!window.confirm(`Delete ${multiSelect.length} files permanently?`)) return;

    try {
      await Promise.all(
        multiSelect.map((f) =>
          axios.delete(`/api/media/${encodeURIComponent(f.name)}?cat=${encodeURIComponent(f.folder)}`)
        )
      );
      toast.success("Deleted selected files", { style: toastStyle });
      setMultiSelect([]);
      loadMedia(1, true);
    } catch (err) {
      console.error("deleteSelectedFiles error", err);
      toast.error("Failed to delete files", { style: toastStyle });
    }
  };

  /* -----------------------------------------
     FAVORITE toggle
  ------------------------------------------*/
  const toggleFavorite = async (item) => {
    try {
      const newState = !(item.meta?.favorite === true);
      await axios.post(
        `/api/media/favorite/${encodeURIComponent(item.name)}?cat=${encodeURIComponent(item.folder)}`,
        { favorite: newState }
      );
      // reload first page to reflect favorite change
      loadMedia(1, true);
    } catch (err) {
      console.error("toggleFavorite", err);
      toast.error("Failed to update favorite", { style: toastStyle });
    }
  };

  /* -----------------------------------------
     META SAVE
  ------------------------------------------*/
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
        `/api/media/meta/${encodeURIComponent(selected.name)}?cat=${encodeURIComponent(selected.folder)}`,
        payload
      );
      toast.success("Updated successfully!", { style: toastStyle });
      setSelected(null);
      loadMedia(1, true);
    } catch (err) {
      console.error("saveMeta error", err);
      toast.error("Failed to update", { style: toastStyle });
    }
  };

  /* -----------------------------------------
     DELETE SINGLE
  ------------------------------------------*/
  const deleteFile = async () => {
    if (!window.confirm("Delete this file permanently?")) return;

    try {
      await axios.delete(
        `/api/media/${encodeURIComponent(selected.name)}?cat=${encodeURIComponent(selected.folder)}`
      );
      toast.success("Deleted", { style: toastStyle });
      setSelected(null);
      loadMedia(1, true);
    } catch (err) {
      console.error("deleteFile error", err);
      toast.error("Delete failed", { style: toastStyle });
    }
  };

  return (
    <div className="media-wrapper">
      {/* ToastContainer configured safely */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
      />

      <h2 className="page-title">Media Library</h2>

      {/* Toolbar */}
      <div className="media-toolbar">
        <div className="toolbar-item full">
          <input
            className="toolbar-input"
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-item">
          <select
            className="toolbar-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Images</option>
            <option value="products">Products</option>
            <option value="posts">Posts</option>
            <option value="banners">Banners</option>
            <option value="categories">Categories</option>
          </select>
        </div>

        <div className="toolbar-item">
          <select
            className="toolbar-select"
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value)}
          >
            {UPLOAD_FOLDERS.map((f) => (
              <option key={f.key} value={f.key}>
                Upload to: {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-item toggle-box">
          <label>
            <input
              type="checkbox"
              checked={showUnusedOnly}
              onChange={() => setShowUnusedOnly(!showUnusedOnly)}
            />
            <span style={{ marginLeft: 8 }}>Show only unused</span>
          </label>
        </div>

        <div className="toolbar-item">
          <label className="file-btn">
            Choose files
            <input
              type="file"
              multiple
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </label>
        </div>

        {multiSelect.length > 0 && (
          <div className="toolbar-item">
            <button className="btn danger" onClick={deleteSelectedFiles}>
              Delete Selected ({multiSelect.length})
            </button>
          </div>
        )}
      </div>

      {/* Drag & Drop */}
      <div
        ref={dropRef}
        className={`drop-area ${dragging ? "drag-active" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        Drag & Drop files here
      </div>

      {/* Grid */}
      <div className="media-grid">
        {media.map((item) => (
          <div
            className={`media-card ${
              multiSelect.some((f) => f.name === item.name && f.folder === item.folder)
                ? "selected"
                : ""
            }`}
            key={`${item.folder}/${item.name}`}
          >
            <img
              src={base_uri + item.url}
              alt={item.meta?.alt || ""}
              onClick={(e) => {
                if (e.shiftKey) toggleMultiSelect(item);
                else setSelected(item);
              }}
            />

            <div
              className={`favorite-icon ${item.meta?.favorite ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item);
              }}
            >
              ★
            </div>
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

      {/* Modal */}
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
                <textarea name="caption" defaultValue={selected.meta?.caption}></textarea>

                <label>Description</label>
                <textarea name="description" defaultValue={selected.meta?.description}></textarea>

                <button className="btn save-btn">Save</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
