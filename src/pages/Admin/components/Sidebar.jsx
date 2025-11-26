// src/pages/Admin/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
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

import CategoryIcon from "@mui/icons-material/Category";
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
      text: "Categories",
      icon: <CategoryIcon />,
      subMenu: [
        { text: "Add Category", icon: <AddIcon />, path: "/admin/categories/add" },
        { text: "View Categories", icon: <ListIcon />, path: "/admin/categories/list" },
      ],
    },

    {
      text: "Products",
      icon: <ProductIcon />,
      subMenu: [
        { text: "Add Product", icon: <AddIcon />, path: "/admin/products/add" },
        { text: "View Products", icon: <ListIcon />, path: "/admin/products/list" },
      ],
    },

    {
      text: "Posts",
      icon: <PostIcon />,
      subMenu: [
        { text: "Add New Post", icon: <AddIcon />, path: "/admin/posts/add" },
        { text: "View Posts", icon: <ListIcon />, path: "/admin/posts/list" },
      ],
    },

    { text: "Banner Settings", icon: <MediaIcon />, path: "/admin/banner" },
    { text: "Logout", icon: <LogoutIcon />, path: "/logout" },
  ];

  return (
    <>
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
          />
        </Drawer>
      ) : (
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
          />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;

/* --------------------------------------------------------------------------
   CONTENT
--------------------------------------------------------------------------- */
function SidebarContent({ menuItems, collapsed, navigate, locationPath, onNavigate }) {
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

      {/* MENU */}
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
    </Box>
  );
}

/* --------------------------------------------------------------------------
   ITEM + SUBMENU HANDLING
--------------------------------------------------------------------------- */
function MenuItemRow({ item, collapsed, navigate, locationPath, onNavigate }) {
  const [open, setOpen] = useState(false);
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;

  const isActive =
    (item.path && locationPath === item.path) ||
    (hasSubMenu && item.subMenu.some((sub) => locationPath.startsWith(sub.path)));

  useEffect(() => {
    if (hasSubMenu) {
      const shouldOpen = item.subMenu.some((sub) => locationPath.startsWith(sub.path));
      setOpen(shouldOpen);
    }
  }, [locationPath]);

  const handleClick = () => {
    if (item.text === "Logout") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    if (hasSubMenu) return setOpen(!open);

    navigate(item.path);
    onNavigate();
  };

  return (
    <>
      <Tooltip title={collapsed ? item.text : ""} placement="right">
        <ListItemButton
          onClick={handleClick}
          sx={{
            pl: collapsed ? 1 : 3,
            py: 1.2,
            bgcolor: isActive ? "#1b1b1b" : "transparent",
            borderLeft: isActive ? "3px solid #5fbe90" : "3px solid transparent",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
            {item.icon}
          </ListItemIcon>

          {!collapsed && <ListItemText primary={item.text} sx={{ ml: 1 }} />}

          {!collapsed && hasSubMenu && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </Tooltip>

      {hasSubMenu && (
        <Collapse in={open} unmountOnExit>
          {item.subMenu.map((sub) => {
            const isSubActive = locationPath.startsWith(sub.path);
            return (
              <ListItemButton
                key={sub.text}
                onClick={() => {
                  navigate(sub.path);
                  onNavigate();
                }}
                sx={{
                  pl: collapsed ? 1 : 6,
                  py: 1.1,
                  bgcolor: isSubActive ? "#1b1b1b" : "transparent",
                  borderLeft: isSubActive
                    ? "3px solid #5fbe90"
                    : "3px solid transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
                  {sub.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={sub.text} sx={{ ml: 1 }} />}
              </ListItemButton>
            );
          })}
        </Collapse>
      )}
    </>
  );
}
