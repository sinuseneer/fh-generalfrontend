// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "../pages/Admin/components/Sidebar";
import Topbar from "../pages/Admin/components/Topbar";

const AdminLayout = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop collapsed state: true => collapsed mini (70px), false => expanded (250px)
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false; // Default → Expanded
  });

  const toggleDesktop = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(!prev));
      return !prev;
    });
  };

  const toggleMobile = () => setMobileOpen((s) => !s);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212" }}>
      {/* Sidebar receives both mobile and desktop states */}
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        toggleMobile={toggleMobile}
        collapsed={collapsed}
        // (optional) you may pass toggleDesktop if you want sidebar itself to toggle
        toggleDesktop={toggleDesktop}
      />

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 3 },
          color: "#fff",
          backgroundColor: "#181818",
          minHeight: "100vh",
        }}
      >
        {/* TopBar: clicking hamburger toggles mobile on small screens,
            and toggles desktop collapse on larger screens */}
        <Topbar
          isMobile={isMobile}
          toggleMobile={toggleMobile}
          collapsed={collapsed}
          toggleDesktop={toggleDesktop}
        />

        {/* Nested routes render here */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
