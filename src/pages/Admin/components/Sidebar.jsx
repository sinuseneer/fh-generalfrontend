// src/pages/Admin/components/Sidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";

import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  PhotoLibrary as MediaIcon,
  Inventory2 as ProductIcon,
  Article as PostIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  ListAlt as ListIcon,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { baseUrl } from "../../../utils/config";

const SIDEBAR_EXPANDED_WIDTH = 250;
const SIDEBAR_COLLAPSED_WIDTH = 70;

const Sidebar = ({ isMobile, mobileOpen, toggleMobile, collapsed, toggleDesktop }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Media", icon: <MediaIcon />, path: "/admin/media" },

    {
      text: "Products",
      icon: <ProductIcon />,
      key: "products",
      subMenu: [
        { text: "Add Product", icon: <AddIcon />, path: "/admin/products/add" },
        { text: "View Products", icon: <ListIcon />, path: "/admin/products/list" },
      ],
    },

    {
      text: "Posts",
      icon: <PostIcon />,
      key: "posts",
      subMenu: [
        { text: "Add New Post", icon: <AddIcon />, path: "/admin/posts/add" },
        { text: "View Posts", icon: <ListIcon />, path: "/admin/posts/list" },
      ],
    },

    { text: "Banner Settings", icon: <MediaIcon />, path: "/admin/banner" },

    // LOGOUT option
    { text: "Logout", icon: <LogoutIcon />, path: "/logout" },
  ];

  return (
    <>
      {/* MOBILE SIDEBAR */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobile}
          BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.6)" } }}
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_EXPANDED_WIDTH,
              bgcolor: "#0b0b0b",
              color: "#f5f5f5",
              borderRight: "1px solid #1c1c1c",
            },
          }}
        >
          <SidebarContent
            menuItems={menuItems}
            collapsed={false}
            navigate={navigate}
            locationPath={location.pathname}
            onNavigate={toggleMobile}
            toggleDesktop={toggleDesktop}
          />
        </Drawer>
      ) : (
        // DESKTOP SIDEBAR
        <Drawer
          variant="permanent"
          open
          sx={{
            width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
            "& .MuiDrawer-paper": {
              width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
              bgcolor: "#0b0b0b",
              color: "#f5f5f5",
              borderRight: "1px solid #1c1c1c",
              transition: "0.22s ease-in-out",
            },
          }}
        >
          <SidebarContent
            menuItems={menuItems}
            collapsed={collapsed}
            navigate={navigate}
            locationPath={location.pathname}
            onNavigate={() => {}}
            toggleDesktop={toggleDesktop}
          />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;

/* --------------------------------------------------------------------------
   SIDEBAR CONTENT (Shared for mobile and desktop)
--------------------------------------------------------------------------- */
function SidebarContent({ menuItems, collapsed, navigate, locationPath, onNavigate, toggleDesktop }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid #1c1c1c",
          bgcolor: "#111",
        }}
      >
        <img
          src={`${baseUrl}images/logo.svg`}
          alt="Admin Logo"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "contain",
          }}
        />

        {!collapsed && (
          <Typography variant="h6" sx={{ lineHeight: 1.2, fontWeight: 500 }}>
            GENERAL <br /> EQUIPMENTS
          </Typography>
        )}
      </Box>

      {/* MENU AREA */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <MenuItemRow
              key={item.text}
              item={item}
              collapsed={collapsed}
              navigate={navigate}
              locationPath={locationPath}
              onNavigate={onNavigate}
            />
          ))}
        </List>
      </Box>

      {/* FOOTER BUTTON: collapse toggle */}
      {!collapsed ? (
        <ListItemButton onClick={toggleDesktop} sx={{ borderTop: "1px solid #1c1c1c" }}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Collapse" />
        </ListItemButton>
      ) : (
        <Tooltip title="Expand" placement="right">
          <ListItemButton
            onClick={toggleDesktop}
            sx={{ justifyContent: "center", borderTop: "1px solid #1c1c1c" }}
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <DashboardIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      )}
    </Box>
  );
}

/* --------------------------------------------------------------------------
   MENU ITEM + SUBMENU HANDLING
--------------------------------------------------------------------------- */
function MenuItemRow({ item, collapsed, navigate, locationPath, onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_expiry");
    localStorage.removeItem("admin_info");
    navigate("/login");
  };

  const handleClick = () => {
    if (item.text === "Logout") return handleLogout();

    if (item.subMenu) {
      setOpen((prev) => !prev);
    } else {
      navigate(item.path);
      onNavigate();
    }
  };

  return (
    <>
      {/* MAIN MENU BUTTON */}
      <Tooltip title={collapsed ? item.text : ""} placement="right">
        <ListItemButton
          onClick={handleClick}
          sx={{
            pl: collapsed ? 1 : 3,
            py: 1.2,
            bgcolor: locationPath === item.path ? "#1b1b1b" : "transparent",
            borderLeft:
              locationPath === item.path ? "3px solid #5fbe90" : "3px solid transparent",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
            {item.icon}
          </ListItemIcon>

          {!collapsed && <ListItemText primary={item.text} sx={{ ml: 1 }} />}

          {!collapsed && item.subMenu && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </Tooltip>

      {/* SUBMENU */}
      {item.subMenu && (
        <Collapse in={open} unmountOnExit>
          {item.subMenu.map((subItem) => (
            <ListItemButton
              key={subItem.text}
              onClick={() => {
                navigate(subItem.path);
                onNavigate();
              }}
              sx={{
                pl: collapsed ? 1 : 6,
                py: 1.1,
                bgcolor: locationPath === subItem.path ? "#1b1b1b" : "transparent",
                borderLeft:
                  locationPath === subItem.path
                    ? "3px solid #5fbe90"
                    : "3px solid transparent",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
                {subItem.icon}
              </ListItemIcon>

              {!collapsed && <ListItemText primary={subItem.text} sx={{ ml: 1 }} />}
            </ListItemButton>
          ))}
        </Collapse>
      )}
    </>
  );
}
