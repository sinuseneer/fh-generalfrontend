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
  Backdrop,
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

  const [openMenus, setOpenMenus] = useState({ products: false, posts: false });

  const handleToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Media", icon: <MediaIcon />, path: "/admin/media" },
    {
      text: "Products",
      icon: <ProductIcon />,
      subMenu: [
        { text: "Add Product", icon: <AddIcon />, path: "/admin/products/add" },
        { text: "View Products", icon: <ListIcon />, path: "/admin/products/list" },
      ],
      key: "products",
    },
    {
      text: "Posts",
      icon: <PostIcon />,
      subMenu: [
        { text: "Add New Post", icon: <AddIcon />, path: "/admin/posts/add" },
        { text: "View Posts", icon: <ListIcon />, path: "/admin/posts/list" },
      ],
      key: "posts",
    },
    {
      text: "Banner Settings",
      icon: <MediaIcon />,
      path: "/admin/banner",
    },
    { text: "Logout", icon: <LogoutIcon />, path: "/login" },
  ];

  // Drawer props differ for mobile vs desktop
  if (isMobile) {
    // Temporary drawer (mobile) — uses MUI's backdrop; we customize its color via BackdropProps
    return (
      <>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobile}
          ModalProps={{
            keepMounted: true,
          }}
          BackdropProps={{
            sx: { backgroundColor: "rgba(0,0,0,0.6)" }, // dark-glass overlay
          }}
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
            navigate={navigate}
            locationPath={location.pathname}
            closeOnNavigate={() => {
              toggleMobile();
            }}
            collapsed={false}
          />
        </Drawer>
      </>
    );
  }

  // Desktop permanent drawer with collapsible (mini) mode
  return (
    <>
      <Drawer
        variant="permanent"
        open
        sx={{
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
            overflowX: "hidden",
            bgcolor: "#0b0b0b",
            color: "#f5f5f5",
            borderRight: "1px solid #1c1c1c",
            transition: "width 220ms ease-in-out, min-width 220ms ease-in-out",
          },
        }}
      >
        <SidebarContent
          menuItems={menuItems}
          navigate={navigate}
          locationPath={location.pathname}
          closeOnNavigate={() => {
            /* on desktop we don't auto-close, but we keep this callback */
          }}
          collapsed={collapsed}
          toggleDesktop={toggleDesktop}
        />
      </Drawer>
    </>
  );
};

export default Sidebar;

/* ---------- SidebarContent - shared between mobile & desktop ---------- */
function SidebarContent({ menuItems, navigate, locationPath, closeOnNavigate, collapsed, toggleDesktop }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
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
        <Box
          component="img"
          src={`${baseUrl}images/logo.svg`}
          alt="Admin Logo"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "contain",
            ml: collapsed ? 0.5 : 0,
          }}
        />

        {/* Show title only when expanded */}
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#fff", fontSize: "16px" }}>
            GENERAL <br /> EQUIPMENTS
          </Typography>
        )}

        {/* If collapsed show a small spacer to center icons */}
        {collapsed && <Box sx={{ flexGrow: 1 }} />}
      </Box>

      {/* Menu list */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <MenuRow
              key={item.text}
              item={item}
              navigate={navigate}
              locationPath={locationPath}
              closeOnNavigate={closeOnNavigate}
              collapsed={collapsed}
              toggleDesktop={toggleDesktop}
            />
          ))}
        </List>
      </Box>

      {/* Footer - collapse/expand control (desktop only) */}
      <Box sx={{ p: 1, borderTop: "1px solid #1c1c1c" }}>
        {!collapsed ? (
          <ListItemButton
            onClick={() => toggleDesktop && toggleDesktop()}
            sx={{
              borderRadius: 1,
              "&:hover": { bgcolor: "#1b1b1b" },
            }}
          >
            <ListItemIcon>
              {/* reuse DashboardIcon as a chevron-like control; feel free to replace */}
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Collapse" />
          </ListItemButton>
        ) : (
          <Tooltip title="Expand" placement="right">
            <ListItemButton
              onClick={() => toggleDesktop && toggleDesktop()}
              sx={{
                justifyContent: "center",
                minHeight: 48,
                borderRadius: 1,
                "&:hover": { bgcolor: "#1b1b1b" },
              }}
            >
              <ListItemIcon sx={{ justifyContent: "center" }}>
                <DashboardIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

/* ---------- MenuRow component ---------- */
function MenuRow({ item, navigate, locationPath, closeOnNavigate, collapsed, toggleDesktop }) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    if (typeof closeOnNavigate === "function") closeOnNavigate();
  };

  if (!item.subMenu) {
    // Simple item
    return (
      <Tooltip title={collapsed ? item.text : ""} placement="right">
        <ListItemButton
          onClick={() => handleNavigate(item.path)}
          sx={{
            pl: collapsed ? 1.2 : 3,
            py: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            backgroundColor: locationPath === item.path ? "#1b1b1b" : "transparent",
            borderLeft: locationPath === item.path ? "3px solid #5fbe90" : "3px solid transparent",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
            {item.icon}
          </ListItemIcon>

          {!collapsed && <ListItemText primary={item.text} sx={{ ml: 2 }} />}
        </ListItemButton>
      </Tooltip>
    );
  }

  // Item with submenu
  return (
    <>
      <Tooltip title={collapsed ? item.text : ""} placement="right">
        <ListItemButton
          onClick={() => setOpen((s) => !s)}
          sx={{
            pl: collapsed ? 1.2 : 3,
            py: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            justifyContent: collapsed ? "center" : "space-between",
            backgroundColor: open ? "#1b1b1b" : "transparent",
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
            {item.icon}
          </ListItemIcon>

          {!collapsed && <ListItemText primary={item.text} />}

          {!collapsed && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </Tooltip>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {item.subMenu.map((sub) => (
          <ListItemButton
            key={sub.text}
            onClick={() => handleNavigate(sub.path)}
            sx={{
              pl: collapsed ? 1.2 : 6,
              py: 1.1,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              backgroundColor: locationPath === sub.path ? "#1b1b1b" : "transparent",
              borderLeft: locationPath === sub.path ? "3px solid #5fbe90" : "3px solid transparent",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
              {sub.icon}
            </ListItemIcon>

            {!collapsed && <ListItemText primary={sub.text} sx={{ ml: 1.2 }} />}
          </ListItemButton>
        ))}
      </Collapse>
    </>
  );
}
