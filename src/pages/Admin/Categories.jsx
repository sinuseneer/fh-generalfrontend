import axios from "axios";
import api_uri, { base_uri } from "../../config/api";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Table,
  Form,
  Button,
  Container,
  Image,
  Modal,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

// Drag & Drop (Vite friendly)
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

// React Router v6 blocker (unstable API — available in v6.4+)
import { unstable_useBlocker as useBlocker } from "react-router-dom";
import { toast } from "react-toastify";

function usePrompt(when, message) {
  // when = boolean, message = string
  const blocker = useBlocker(when);

  useEffect(() => {
    if (!blocker) return;

    if (blocker.state === "blocked") {
      const allow = window.confirm(message || "You have unsaved changes. Leave anyway?");
      if (allow) {
        blocker.proceed(); // allow navigation
      } else {
        blocker.reset(); // cancel navigation
      }
    }
  }, [blocker, message]);
}

function Categories() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [categories, setCategories] = useState([]);
  const [orderChanged, setOrderChanged] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    axios.post(`${api_uri}category/view`)
      .then(response => {
        const sorted = [...(response.data.categories || [])].sort(
          (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
        );
        setCategories(sorted);
        setOrderChanged(false);
      })
      .catch(err => console.error("Error fetching categories:", err));
  };

  // Search
  const searchCategory = (data) => {
    axios.post(`${api_uri}category/search`, data)
      .then(res => {
        const sorted = [...(res.data.categories || [])].sort(
          (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
        );
        setCategories(sorted);
      })
      .catch(() => toast.error("Search failed"));
  };

  // Delete
  const deleteCategory = () => {
    if (!selectedCategory) return;

    axios.post(`${api_uri}category/delete`, { id: selectedCategory })
      .then(() => {
        toast.success("Category deleted!");
        setCategories(prev => prev.filter(c => c._id !== selectedCategory));
      })
      .catch(() => toast.error("Delete failed"))
      .finally(() => {
        setShowDeleteModal(false);
        setSelectedCategory(null);
      });
  };

  // Edit
  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.category_name);
    setPreview(`${base_uri}${cat.category_image}`);
    setShowEditModal(true);
  };

  const updateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_name", name);
    if (newImage) formData.append("image", newImage);

    try {
      const res = await axios.put(
        `${api_uri}category/update/${editingCategory._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("Updated successfully");
        loadCategories();
        setShowEditModal(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Server error while updating");
    }
  };

  // Drag & Drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(categories);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    setCategories(updated);
    setOrderChanged(true);
  };

  // Save order to backend
  const saveOrder = async () => {
    try {
      await axios.post(`${api_uri}category/update-priority`, {
        categories: categories.map((cat, index) => ({
          id: cat._id,
          priority: index,
        })),
      });
      toast.success("Order saved");
      setOrderChanged(false);
    } catch (err) {
      console.error("Save order error:", err);
      toast.error("Failed to save order");
    }
  };

  // ---------------------------
  // External unload protection
  // ---------------------------
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (orderChanged) {
        e.preventDefault();
        e.returnValue = ""; // required for Chrome to show prompt
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [orderChanged]);

  // ---------------------------
  // Internal navigation protection (React Router v6.4+)
  // ---------------------------
  usePrompt(orderChanged, "You have unsaved changes. Are you sure you want to leave without saving?");

  return (
    <Container fluid className="p-4">
      <Card className="bg-dark text-light shadow-lg rounded-4">
        <Card.Body>

          {/* Save Order top button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="fw-bold text-uppercase mb-0">Manage Categories</h3>
              <small className="text-secondary">Drag to reorder categories, then click Save Order.</small>
            </div>

            <div className="d-flex align-items-center gap-2">
              {orderChanged && (
                <Button variant="info" className="fw-semibold" onClick={saveOrder}>
                  💾 Save Order
                </Button>
              )}

              <Button variant="success" className="fw-semibold" href="/admin/categories/add">
                <i className="bi bi-plus-circle me-1" /> Add Category
              </Button>
            </div>
          </div>

          {/* Search */}
          <Form onSubmit={handleSubmit(searchCategory)} className="p-3 bg-secondary bg-opacity-25 rounded-3 mb-4">
            <Row className="align-items-center">
              <Col md={10}>
                <Form.Control
                  type="text"
                  placeholder="Search by category name..."
                  {...register("category_name", { required: "Category name is required" })}
                  className="bg-dark text-light border-secondary"
                />
                {errors.category_name && <small className="text-danger">{errors.category_name.message}</small>}
              </Col>
              <Col md={2}>
                <Button variant="primary" type="submit" className="w-100">
                  <FaSearch className="me-2" /> Search
                </Button>
              </Col>
            </Row>
          </Form>

          {/* Table */}
          <div className="table-responsive">
            <Table bordered hover variant="dark" className="align-middle text-center shadow-sm">
              <thead>
                <tr style={{ backgroundColor: "#1f1f1f" }}>
                  <th style={{ width: "60px" }}>Drag</th>
                  <th style={{ width: "120px" }}>Image</th>
                  <th>Name</th>
                  <th style={{ width: "120px" }}>Priority</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {categories.length > 0 ? (
                        categories.map((cat, index) => (
                          <Draggable key={cat._id} draggableId={cat._id} index={index}>
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  background: snapshot.isDragging ? "#0f1720" : undefined,
                                }}
                              >
                                <td {...provided.dragHandleProps} style={{ cursor: "grab" }}>
                                  <span style={{ fontSize: 20, opacity: 0.75 }}>☰</span>
                                </td>

                                <td>
                                  <Image
                                    src={cat.category_image ? `${base_uri}${cat.category_image}` : "/images/no-image.jpg"}
                                    height="70"
                                    width="70"
                                    rounded
                                    className="shadow-sm border border-secondary"
                                  />
                                </td>

                                <td className="fw-semibold">{cat.category_name}</td>

                                <td>{cat.priority ?? 0}</td>

                                <td>
                                  <Button variant="outline-warning" size="sm" className="me-2" onClick={() => openEditModal(cat)}>
                                    <FaEdit />
                                  </Button>
                                  <Button variant="outline-danger" size="sm" onClick={() => { setSelectedCategory(cat._id); setShowDeleteModal(true); }}>
                                    <FaTrash />
                                  </Button>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-secondary py-4">No categories found.</td>
                        </tr>
                      )}

                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          Are you sure you want to delete this category? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="bg-dark text-light">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteCategory}><FaTrash className="me-1" /> Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form onSubmit={updateCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                className="bg-secondary bg-opacity-25 text-light border-secondary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Image</Form.Label>
              <br />
              <Image src={preview} width="100" height="100" rounded className="border border-secondary" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload New Image (optional)</Form.Label>
              <Form.Control
                type="file"
                className="bg-secondary bg-opacity-25 text-light border-secondary"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </Form.Group>

            <Button variant="info" type="submit" className="w-100 fw-semibold">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Categories;
