import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// User Pages
import About from "./pages/User/About.jsx";
import Product from "./pages/User/Product.jsx";
import BlogsPage from "./pages/User/BlogsPage.jsx";
import Contact from "./pages/User/Contact.jsx";
import ProductDetails from "./pages/User/ProductDetails.jsx";
import BlogDetailPage from "./pages/User/BlogDetailPage.jsx";

// Admin Pages
import Login from "./pages/Admin/Login.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Categories from "./pages/Admin/Categories.jsx";
import AddCategory from "./pages/Admin/AddCategory.jsx";
import Products from "./pages/Admin/Products.jsx";
import ProductAdd from "./pages/Admin/ProductAdd.jsx";
import ProductEdit from "./pages/Admin/ProductEdit.jsx";
import ProductImages from "./pages/Admin/ProductImages.jsx";
import AccountSettings from "./pages/Admin/AccountSettings.jsx";
import AddPost from "./pages/Admin/AddPost.jsx";
import PostsList from "./pages/Admin/PostsList.jsx";
import BannerSettings from "./pages/Admin/BannerSettings.jsx";

// Components (for Home)
import HeroSection from "./components/HeroSection.jsx";
import ProductCarousel from "./components/ProductCarousel.jsx";
import AboutSection from "./components/AboutSection.jsx";
import FeatureProducts from "./components/FeatureProducts.jsx";
import WhyChooseUs from "./components/WhyChooseUs.jsx";
import LatestNews from "./components/LatestNews.jsx";
import PartnerSection from "./components/PartnerSection.jsx";
import MediaGallery from "./pages/Admin/MediaGallery.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";


function App() {
  return (
    <Router>
      {/* ⭐ Scroll to top on every route change */}
      <ScrollToTop />

      <Routes>
        {/* ========== User Routes ========== */}
        <Route
          path="/"
          element={
            <UserLayout>
              <HeroSection />
              <ProductCarousel />
              <AboutSection />
              <FeatureProducts />
              <WhyChooseUs />
              <LatestNews />
              <PartnerSection />
            </UserLayout>
          }
        />

        <Route
          path="/about"
          element={
            <UserLayout>
              <About />
            </UserLayout>
          }
        />

        <Route
          path="/product"
          element={
            <UserLayout>
              <Product />
            </UserLayout>
          }
        />

        <Route
          path="/product/:id"
          element={
            <UserLayout>
              <ProductDetails />
            </UserLayout>
          }
        />

        <Route
          path="/blog"
          element={
            <UserLayout>
              <BlogsPage />
            </UserLayout>
          }
        />

        <Route
          path="/blog/:id"
          element={
            <UserLayout>
              <BlogDetailPage />
            </UserLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <UserLayout>
              <Contact />
            </UserLayout>
          }
        />

        {/* ========== Admin Routes ========== */}
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/categories/list" element={<Categories />} />
          <Route path="/admin/categories/add" element={<AddCategory />} />
          <Route path="/admin/products/list" element={<Products />} />
          <Route path="/admin/products/add" element={<ProductAdd />} />
          <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
          <Route
            path="/admin/product-images/:productId"
            element={<ProductImages />}
          />
          <Route path="/admin/settings" element={<AccountSettings />} />
          <Route path="/admin/banner" element={<BannerSettings />} />
          <Route path="/admin/posts/add" element={<AddPost />} />
          <Route path="/admin/posts/list" element={<PostsList />} />
          <Route path="/admin/media" element={<MediaGallery />} />
        </Route>

        {/* ========== Fallback ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
      />
    </Router>
  );
}

export default App;
