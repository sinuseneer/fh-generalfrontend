import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MediaGallery.css";

const LIMIT = 40;

export default function MediaGallery() {
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [selected, setSelected] = useState(null);

  const loadMedia = async (pageNum = 1, reset = false) => {
    setLoading(true);

    const res = await axios.get("/api/media", {
      params: {
        page: pageNum,
        limit: LIMIT,
        search,
        category,
      },
    });

    if (reset) {
      setMedia(res.data.items);
    } else {
      setMedia((prev) => [...prev, ...res.data.items]);
    }

    setTotal(res.data.total);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia(1, true); // reset list
    setPage(1);
  }, [search, category]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadMedia(next);
  };

  const saveMeta = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const payload = {
      title: form.get("title"),
      alt: form.get("alt"),
      caption: form.get("caption"),
      description: form.get("description"),
    };

    await axios.post(
      `/api/media/meta/${selected.name}?cat=${selected.folder}`,
      payload
    );

    alert("Changes saved");
    setSelected(null);
    loadMedia(1, true);
  };

  const deleteFile = async () => {
    if (!window.confirm("Delete this file permanently?")) return;

    await axios.delete(
      `/api/media/${selected.name}?cat=${selected.folder}`
    );

    setSelected(null);
    loadMedia(1, true);
  };

  return (
    <div className="media-wrapper">

      <h2 className="page-title">Media Library</h2>

      <div className="media-filters">
        <input
          type="text"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
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

      <div className="media-grid">
        {media.map((item) => (
          <div
            className="media-card"
            key={item.name}
            onClick={() => setSelected(item)}
          >
            <img src={item.url} alt={item.meta?.alt || ""} />
          </div>
        ))}
      </div>

      {media.length < total && (
        <div className="load-more-wrap">
          <button className="btn" onClick={loadMore}>Load More</button>
        </div>
      )}

      {loading && <p style={{ color: "#999", marginTop: 15 }}>Loading...</p>}

      {selected && (
        <div className="media-modal">
          <div className="modal-inner">

            <button className="modal-close" onClick={() => setSelected(null)}>
              ✕
            </button>

            <div className="modal-left">
              <img src={selected.url} alt="" />

              <div className="modal-actions">
                <a
                  href={selected.downloadUrl}
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
