import React, { useEffect, useState } from "react";
import axios from "axios";
import api_uri from "../../config/api";
import { getImageUrl } from "../../utils/imageUrl";
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
  Spinner,
} from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";

function Products() {
  const { register, handleSubmit } = useForm();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  // Modal for Product Info
  const [showInfo, setShowInfo] = useState(false);
  const [infoData, setInfoData] = useState([]);
  const [infoTitle, setInfoTitle] = useState("");

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await axios.post(`${api_uri}category/view`);
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api_uri}product/viewallProducts`);
      const productsData = res.data.products || res.data;
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (data) => {
    setLoading(true);
    try {
      const payload = {
        product_name: data.product_name || "",
        CAT_ID: selectedCategory || "",
      };
      const res = await axios.post(`${api_uri}product/searchProducts`, payload);

      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
        toast.warning("No matching products found");
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (catId) => {
    setSelectedCategory(catId);
    if (!catId) return loadProducts();

    setLoading(true);
    try {
      const res = await axios.post(`${api_uri}product/view-by-category`, {
        CAT_ID: catId,
      });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      toast.error("Failed to filter products");
    } finally {
      setLoading(false);
    }
  };

  // Delete modal
  const handleShow = (pid) => {
    setSelectedProduct(pid);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedProduct(null);
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const res = await axios.post(`${api_uri}product/delete`, {
        id: selectedProduct,
      });
      if (res.data.success) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p._id !== selectedProduct));
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      handleClose();
    }
  };

  // View product_info modal
  const viewInfo = (product) => {
    setInfoData(product.product_info || []);
    setInfoTitle(product.product_name);
    setShowInfo(true);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 fw-bold">Manage Products</h2>

      {/* Search & Filter */}
      <Form
        onSubmit={handleSubmit(searchProducts)}
        className="p-3 border rounded shadow bg-light mb-4"
      >
        <Row className="align-items-center">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Search by product name"
              {...register("product_name")}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => filterByCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button type="submit" variant="primary" className="w-100">
              <FaSearch className="me-1" /> Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Loading Spinner */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2 fw-semibold text-primary">Loading...</span>
        </div>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="bg-white text-center"
        >
          <thead>
            <tr>
              <th>Image</th>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Product Info</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.main_image ? (
                      <Image
                        src={getImageUrl(p.main_image)}
                        alt="product"
                        height="80"
                        width="80"
                        rounded
                      />
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>

                  <td>{p.prod_id}</td>
                  <td>{p.product_name}</td>
                  <td>{p.CAT_ID?.category_name || "—"}</td>
                  <td>{p.description || "—"}</td>

                  <td>
                    {Array.isArray(p.product_info) &&
                    p.product_info.length > 0 ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        style={{ width: "100px" }}
                        onClick={() => viewInfo(p)}
                      >
                        View Specs
                      </Button>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      href={`/admin/products/edit/${p._id}`}
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        width: "130px",
                      }}
                    >
                      <FaEdit /> Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleShow(p._id)}
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        width: "130px",
                      }}
                    >
                      <FaTrash /> Delete
                    </Button>

                    <Button
                      variant="info"
                      size="sm"
                      href={`/admin/product-images/${p._id}`}
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        width: "130px",
                      }}
                    >
                      <FaTag /> Set Thumbnail
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted py-3">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteProduct}>
            <FaTrash /> Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Product Info Modal */}
      <Modal show={showInfo} onHide={() => setShowInfo(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Specifications — {infoTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {infoData.length === 0 ? (
            <p className="text-muted">No technical info available.</p>
          ) : (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {infoData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.key}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfo(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Products;
