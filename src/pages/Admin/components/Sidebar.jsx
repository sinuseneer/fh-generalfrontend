import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
  Typography,
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
import "../../../App.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Control open/close of collapsible menus
  const [openMenus, setOpenMenus] = useState({
    products: false,
    posts: false,
  });

  const handleToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Menu list
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Media", icon: <MediaIcon />, path: "/admin/media" },
    {
      text: "Products",
      icon: <ProductIcon />,
      subMenu: [
        { text: "Add Product", icon: <AddIcon />, path: "/admin/products/add" },
        {
          text: "View Products",
          icon: <ListIcon />,
          path: "/admin/products/list",
        },
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
      icon: <MediaIcon />, // or use another icon you like
      path: "/admin/banner",
    },

    { text: "Logout", icon: <LogoutIcon />, path: "/login" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          bgcolor: "#0b0b0b",
          color: "#f5f5f5",
          borderRight: "1px solid #1c1c1c",
        },
      }}
    >
      {/* Logo/Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5, // space between logo and text
          borderBottom: "1px solid #1c1c1c",
          bgcolor: "#111",
        }}
      >
        {/* 🖼️ Logo */}
        <Box
          component="img"
          src={`${baseUrl}images/logo.svg`} // ✅ your logo path here
          alt="Admin Logo"
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%", // optional: round logo
            objectFit: "contain",
          }}
        />

        {/* 🧾 Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: "#ffffffff",
            textAlign: "start",
            fontSize: "19px",

            // letterSpacing: 1,
          }}
        >
          GENERAL <br /> EQUIPMENTS
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {!item.subMenu ? (
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  pl: 3,
                  py: 1.2,
                  backgroundColor:
                    location.pathname === item.path ? "#1b1b1b" : "transparent",
                  borderLeft:
                    location.pathname === item.path
                      ? "3px solid #5fbe90ff"
                      : "3px solid transparent",
                  "&:hover": {
                    backgroundColor: "#1b1b1b",
                    color: "#81c0a1ff",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {item.icon}
                  <ListItemText primary={item.text} />
                </Box>
              </ListItemButton>
            ) : (
              <>
                {/* Collapsible Section */}
                <ListItemButton
                  onClick={() => handleToggle(item.key)}
                  sx={{
                    pl: 3,
                    py: 1.2,
                    "&:hover": {
                      backgroundColor: "#1b1b1b",
                      color: "#00e676",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      {item.icon}
                      <ListItemText primary={item.text} />
                    </Box>
                    {openMenus[item.key] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                </ListItemButton>

                <Collapse in={openMenus[item.key]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subMenu.map((sub) => (
                      <ListItemButton
                        key={sub.text}
                        sx={{
                          pl: 6,
                          py: 1.1,
                          backgroundColor:
                            location.pathname === sub.path
                              ? "#1b1b1b"
                              : "transparent",
                          borderLeft:
                            location.pathname === sub.path
                              ? "3px solid #00e676"
                              : "3px solid transparent",
                          "&:hover": {
                            backgroundColor: "#1b1b1b",
                            color: "#00e676",
                          },
                        }}
                        onClick={() => navigate(sub.path)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          {sub.icon}
                          <ListItemText primary={sub.text} />
                        </Box>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
