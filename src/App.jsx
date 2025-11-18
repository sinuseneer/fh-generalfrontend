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
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// User Pages
import About from "./pages/User/About";
import Product from "./pages/User/Product";
import BlogsPage from "./pages/User/BlogsPage";
import Contact from "./pages/User/Contact";
import ProductDetails from "./pages/User/ProductDetails";
import BlogDetail from "./pages/User/BlogDetail";


// Admin Pages
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import Media from "./pages/Admin/Media";
import Categories from "./pages/Admin/Categories";
import AddCategory from "./pages/Admin/AddCategory";
import Products from "./pages/Admin/Products";
import ProductAdd from "./pages/Admin/ProductAdd";
import ProductEdit from "./pages/Admin/ProductEdit";
import ProductImages from "./pages/Admin/ProductImages";
import AccountSettings from "./pages/Admin/AccountSettings.jsx";

// Components (for Home)
import HeroSection from "./components/HeroSection.jsx";
import ProductCarousel from "./components/ProductCarousel";
import AboutSection from "./components/AboutSection";
import FeatureProducts from "./components/FeatureProducts";
import WhyChooseUs from "./components/WhyChooseUs";
import LatestNews from "./components/LatestNews";
import PartnerSection from "./components/PartnerSection";
import BannerSettings from "./pages/Admin/BannerSettings.jsx";

function App() {
  return (
    <Router>
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
              <BlogDetail />
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

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/media" element={<Media />} />
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
