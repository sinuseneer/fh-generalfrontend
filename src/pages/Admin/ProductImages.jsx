import React, { useEffect, useState } from "react";
import axios from "axios";
import api_uri, { base_uri } from "../../config/api";
import { useParams } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Container } from "react-bootstrap";
import { toast } from "react-toastify";

function ProductImages() {
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product images
  const fetchImages = async () => {
    try {
  const res = await axios.get(`${api_uri}product/images/${productId}`);
      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (error) {
      console.error("❌ Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [productId]);

  // Set selected image as main
  const handleSetMain = async (imageId) => {
    try {
  const res = await axios.put(`${api_uri}product/setMainImage/${imageId}`);
      toast.success(res.data.message);
      // Update local state
      setImages((prev) =>
        prev.map((img) =>
          img._id === imageId ? { ...img, is_main: true } : { ...img, is_main: false }
        )
      );
    } catch (error) {
      console.error("❌ Error setting main image:", error);
      toast.error("Failed to update main image");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="mt-4">
      <h3 className="fw-bold mb-4 text-center">Manage Product Images</h3>
      <Row>
        {images.length > 0 ? (
          images.map((img) => (
            <Col key={img._id} md={3} className="mb-3">
              <Card className="shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src={`${base_uri}${img.image_path}`}
                  alt="Product"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  {img.is_main ? (
                    <Button variant="success" disabled>
                      ✅ Main Thumbnail
                    </Button>
                  ) : (
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSetMain(img._id)}
                    >
                      Set as Main
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">No images found for this product.</p>
        )}
      </Row>
    </Container>
  );
}

export default ProductImages;
