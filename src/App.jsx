import React, { Suspense, lazy } from "react";
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

// Core Components (NOT lazy)
import SEO from "./components/SEO/SEO.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";

// ---------- LAZY LOADED USER COMPONENTS ----------
const ProductCarousel = lazy(() =>
  import("./components/ProductCarousel.jsx")
);
const AboutSection = lazy(() =>
  import("./components/AboutSection.jsx")
);
const FeatureProducts = lazy(() =>
  import("./components/FeatureProducts.jsx")
);
const WhyChooseUs = lazy(() =>
  import("./components/WhyChooseUs.jsx")
);
const LatestNews = lazy(() =>
  import("./components/LatestNews.jsx")
);
const PartnerSection = lazy(() =>
  import("./components/PartnerSection.jsx")
);
const SEOContentSection = lazy(() =>
  import("./components/SEOContentSection.jsx")
);

// ---------- LAZY LOADED USER PAGES ----------
const About = lazy(() => import("./pages/User/About.jsx"));
const Product = lazy(() => import("./pages/User/Product.jsx"));
const BlogsPage = lazy(() => import("./pages/User/BlogsPage.jsx"));
const Contact = lazy(() => import("./pages/User/Contact.jsx"));
const ProductDetails = lazy(() =>
  import("./pages/User/ProductDetails.jsx")
);
const BlogDetailPage = lazy(() =>
  import("./pages/User/BlogDetailPage.jsx")
);

// ---------- LAZY LOADED ADMIN PAGES ----------
const Login = lazy(() => import("./pages/Admin/Login.jsx"));
const Dashboard = lazy(() =>
  import("./pages/Admin/Dashboard.jsx")
);
const Categories = lazy(() =>
  import("./pages/Admin/Categories.jsx")
);
const AddCategory = lazy(() =>
  import("./pages/Admin/AddCategory.jsx")
);
const Products = lazy(() =>
  import("./pages/Admin/Products.jsx")
);
const ProductAdd = lazy(() =>
  import("./pages/Admin/ProductAdd.jsx")
);
const ProductEdit = lazy(() =>
  import("./pages/Admin/ProductEdit.jsx")
);
const ProductImages = lazy(() =>
  import("./pages/Admin/ProductImages.jsx")
);
const AccountSettings = lazy(() =>
  import("./pages/Admin/AccountSettings.jsx")
);
const AddPost = lazy(() =>
  import("./pages/Admin/AddPost.jsx")
);
const PostsList = lazy(() =>
  import("./pages/Admin/PostsList.jsx")
);
const BannerSettings = lazy(() =>
  import("./pages/Admin/BannerSettings.jsx")
);
const MediaGallery = lazy(() =>
  import("./pages/Admin/MediaGallery.jsx")
);

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* ========== HOME ROUTE ========== */}
        <Route
          path="/"
          element={
            <UserLayout>
              <SEO
                title="Medical & Industrial Equipment Supplier in the USA"
                description="FH General Equipment is a US-focused supplier of medical, industrial, and general equipment serving customers across the United States with operational support in Guyana."
                canonical="https://fhgeneralequipments.com/"
              />

              {/* LCP CRITICAL */}
              <HeroSection />

              {/* BELOW THE FOLD */}
              <Suspense fallback={null}>
                <ProductCarousel />
                <AboutSection />
                <FeatureProducts />
                <WhyChooseUs />
                <LatestNews />
                <PartnerSection />
                <SEOContentSection />
              </Suspense>
            </UserLayout>
          }
        />

        {/* ========== USER ROUTES ========== */}
        <Route
          path="/about"
          element={
            <UserLayout>
              <Suspense fallback={null}>
                <About />
              </Suspense>
            </UserLayout>
          }
        />

        <Route
          path="/product"
          element={
            <UserLayout>
              <Suspense fallback={null}>
                <Product />
              </Suspense>
            </UserLayout>
          }
        />

        <Route
          path="/product/:id"
          element={
            <UserLayout>
              <Suspense fallback={null}>
                <ProductDetails />
              </Suspense>
            </UserLayout>
          }
        />

        <Route
          path="/blog"
          element={
            <UserLayout>
              <Suspense fallback={null}>
                <BlogsPage />
              </Suspense>
            </UserLayout>
          }
        />

        <Route
          path="/blog/:id"
          element={
            <UserLayout>
              <Suspense fallback={null}>
                <BlogDetailPage />
              </Suspense>
            </UserLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <UserLayout>
              <Suspense fallback={null}>
                <Contact />
              </Suspense>
            </UserLayout>
          }
        />

        {/* ========== ADMIN ROUTES ========== */}
        <Route
          path="/login"
          element={
            <Suspense fallback={null}>
              <Login />
            </Suspense>
          }
        />

        <Route
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={null}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/categories/list"
            element={
              <Suspense fallback={null}>
                <Categories />
              </Suspense>
            }
          />
          <Route
            path="/admin/categories/add"
            element={
              <Suspense fallback={null}>
                <AddCategory />
              </Suspense>
            }
          />
          <Route
            path="/admin/products/list"
            element={
              <Suspense fallback={null}>
                <Products />
              </Suspense>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <Suspense fallback={null}>
                <ProductAdd />
              </Suspense>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <Suspense fallback={null}>
                <ProductEdit />
              </Suspense>
            }
          />
          <Route
            path="/admin/product-images/:productId"
            element={
              <Suspense fallback={null}>
                <ProductImages />
              </Suspense>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <Suspense fallback={null}>
                <AccountSettings />
              </Suspense>
            }
          />
          <Route
            path="/admin/banner"
            element={
              <Suspense fallback={null}>
                <BannerSettings />
              </Suspense>
            }
          />
          <Route
            path="/admin/posts/add"
            element={
              <Suspense fallback={null}>
                <AddPost />
              </Suspense>
            }
          />
          <Route
            path="/admin/posts/list"
            element={
              <Suspense fallback={null}>
                <PostsList />
              </Suspense>
            }
          />
          <Route
            path="/admin/media"
            element={
              <Suspense fallback={null}>
                <MediaGallery />
              </Suspense>
            }
          />
        </Route>

        {/* ========== FALLBACK ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
