import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Pagination,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import api_uri, { base_uri } from "../../config/api";
import { toast } from "react-toastify";
import Banner from "../../components/Banner";
import ProductCarousel from "../../components/ProductCarousel";
import "./product.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const productsPerPage = 8;

  // ✅ Handle selected category
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || null
  );

  // ✅ Update category if user clicks another category in carousel
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      console.log("location.state.category",location.state.category)
    } else {
      setSelectedCategory(null);
    }
  }, [location.state?.category]);

  // ✅ Fetch products whenever category changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let res;

        if (selectedCategory) {
          // 🔍 Fetch only products for this category
          res = await axios.get(`${api_uri}product/category/${selectedCategory}`);
        } else {
          // 🔍 Otherwise, fetch all products
          res = await axios.get(`${api_uri}product/userview`);
        }

        if (res.data.success) {
          setProducts(res.data.products);
        } else {
          toast.warning("No products found");
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]); // ✅ Re-fetch when category changes

  // ✅ Frontend search (local filtering)
  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (event, page) => setCurrentPage(page);

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <>
      <Banner />

      <Container sx={{ my: 5 }}>
        {/* 🧭 Category Carousel */}
        <ProductCarousel />

        {/* 🔍 Search Section + Dynamic Heading */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          {/* 🏷️ Left: Heading with Category Name */}
          <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  textTransform: "capitalize",
                  color: selectedCategory ? "#000000ff" : "inherit",
                }}
              >
                {selectedCategory ? selectedCategory : "All Products"}
              </Typography>

              {selectedCategory && (
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() => setSelectedCategory(null)}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    minWidth: "unset",
                    borderRadius: "6px",
                    ml: 1,
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Grid>

          {/* 🔎 Right: Search Box */}
          <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              className="search-products"
              fullWidth
              label="Search products..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* 🧩 Product Grid */}
        {loading ? (
          <Box textAlign="center" mt={6}>
            <CircularProgress />
            <Typography mt={2}>Loading products...</Typography>
          </Box>
        ) : currentProducts.length > 0 ? (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="stretch"
            sx={{ textAlign: "center" }}
          >
            {currentProducts.map((product) => (
              <Grid
                item
                key={product._id}
                xs={6}
                sm={6}
                md={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  onClick={() => handleProductClick(product)}
                  sx={{
                    cursor: "pointer",
                    border: "1px solid #f0ececff",
                    borderRadius: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0px 6px 12px rgba(0,0,0,0.18)",
                    },
                    height: 370,
                    width: 275,
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      height: 275,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.main_image
                          ? `${base_uri}${product.main_image}`
                          : "/images/no-image.jpg"
                      }
                      alt={product.product_name}
                      sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                        backgroundColor: "#fff",
                        p: 1,
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      textAlign: "center",
                      px: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "1rem",
                        lineHeight: "1.1rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {product.product_name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.9rem",
                        mt: 1,
                        mb: 1,
                        lineHeight: "1rem",
                      }}
                    >
                      {product.prod_id}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 5 }}>
            No products found.
          </Typography>
        )}

        {/* 🧭 Pagination */}
        {!loading && totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="success"
              size="large"
            />
          </Box>
        )}
      </Container>
    </>
  );
}
