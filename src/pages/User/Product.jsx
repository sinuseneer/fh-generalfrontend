import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Pagination,
  CircularProgress,
  Box,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import api_uri from "../../config/api";
import { toast } from "react-toastify";
import Banner from "../../components/Banner";
import ProductCarousel from "../../components/ProductCarousel";
import ProductCard from "../../components/ProductCard";
import "./product.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const productsPerPage = 12;

  // ✅ Handle selected category
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || null
  );

  // ✅ Update category if user clicks another category in carousel
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      console.log("location.state.category", location.state.category);
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
        res = await axios.get(
          `${api_uri}product/category/${selectedCategory}`
        );
      } else {
        // 🔍 Otherwise, fetch all products
        res = await axios.get(`${api_uri}product/userview`);
      }

      if (res.data.success) {
        // ⭐ Sort latest first
        const sorted = [...res.data.products].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sorted);
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
}, [selectedCategory]);


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
      <div className="hide-banner-mobile">
  <Banner />
</div>

      <Container sx={{ my: 0 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  textTransform: "capitalize",
                  color: selectedCategory ? "#000000ff" : "inherit",
                  marginBottom: "8px",
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
          <div className="products-grid">
            {currentProducts.map((product) => (
              <div key={product._id} className="product-grid-item">
                <ProductCard product={product} onClick={handleProductClick} />
              </div>
            ))}
          </div>
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
              size="large"
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#2da797",
                  color: "#fff",
                },
                "& .MuiPaginationItem-root.Mui-selected:hover": {
                  backgroundColor: "#249f89",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "rgba(45,167,151,0.15)",
                },
              }}
            />
          </Box>
        )}
      </Container>
    </>
  );
}
