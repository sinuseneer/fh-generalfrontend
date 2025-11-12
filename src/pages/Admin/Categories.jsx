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
import { toast } from "react-toastify";

function Categories() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load all categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    
  axios.post(`${api_uri}category/view`)

      .then((response) => {
        setCategories(response.data.categories);
        console.log(Array.isArray(response.data.categories)); // should print true

        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Delete Category
  const deleteCategory = () => {
    if (!selectedCategory) return;

    axios.post(`${api_uri}category/delete`, { id: selectedCategory })
      .then((response) => {
        toast.success("Category deleted successfully!");
        setCategories((prev) =>
          prev.filter((item) => item._id !== selectedCategory)
        );
      })
      .catch(() => toast.error("Error deleting category"))
      .finally(() => {
        setShowDeleteModal(false);
        setSelectedCategory(null);
      });
  };

  // Search category by name
  const searchCategory = (data) => {
    axios.post(`${api_uri}category/search`, data)
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => toast.error("Error searching category"));
  };

  return (
    <Container fluid className="p-4">
      <Card className="bg-dark text-light shadow-lg rounded-4">
        <Card.Body>
          <Row className="align-items-center mb-4">
  <Col md={8}>
    <h3 className="fw-bold text-uppercase">Manage Categories</h3>
    <p className="text-secondary">
      View, search, or delete existing categories.
    </p>
  </Col>

  {/* ➕ Add Category Button */}
  <Col md={4} className="text-end">
    <Button
      variant="success"
      className="fw-semibold px-3 py-2 shadow-sm"
      href="/admin/categories/add"
    >
      <i className="bi bi-plus-circle me-2"></i> Add Category
    </Button>
  </Col>
</Row>


          {/* 🔍 Search Bar */}
          <Form
            onSubmit={handleSubmit(searchCategory)}
            className="p-3 bg-secondary bg-opacity-25 rounded-3 mb-4"
          >
            <Row className="align-items-center">
              <Col md={10}>
                <Form.Control
                  type="text"
                  placeholder="Search by category name..."
                  {...register("category_name", {
                    required: "Category name is required",
                  })}
                  className="bg-dark text-light border-secondary"
                />
                {errors.category_name && (
                  <small className="text-danger">
                    {errors.category_name.message}
                  </small>
                )}
              </Col>
              <Col md={2} className="text-end">
                <Button variant="primary" type="submit" className="w-100">
                  <FaSearch className="me-2" /> Search
                </Button>
              </Col>
            </Row>
          </Form>

          {/* 📋 Category Table */}
          <div className="table-responsive">
            <Table
              bordered
              hover
              variant="dark"
              className="align-middle text-center shadow-sm"
            >
              <thead>
                <tr style={{ backgroundColor: "#1f1f1f" }}>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <Image
                          src={cat.category_image ? `${base_uri}${cat.category_image}` : "/images/no-image.jpg"}
                          alt={cat.category_name}
                          height="70"
                          width="70"
                          rounded
                          className="shadow-sm border border-secondary"
                        />
                      </td>
                      <td className="fw-semibold">{cat.category_name}</td>
                      <td>
                        {new Date(cat.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(cat._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-4">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* 🗑️ Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          Are you sure you want to delete this category? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer className="bg-dark text-light">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteCategory}>
            <FaTrash className="me-1" /> Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Categories;
