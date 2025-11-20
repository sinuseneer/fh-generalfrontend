// src/pages/Admin/components/TopBar.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function TopBar({ isMobile, toggleMobile, collapsed, toggleDesktop }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoriesMenuEl, setCategoriesMenuEl] = useState(null);
  const open = Boolean(anchorEl);
  const openCategories = Boolean(categoriesMenuEl);
  const navigate = useNavigate();

  const handleSettingsClick = (e) => setAnchorEl(e.currentTarget);
  const handleSettingsClose = () => {
    setAnchorEl(null);
    setCategoriesMenuEl(null);
  };

  // Hamburger behavior:
  // - On mobile: toggles the temporary drawer
  // - On desktop: toggles the collapsed/expanded sidebar
  const handleHamburger = () => {
    if (isMobile) toggleMobile();
    else toggleDesktop();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        p: 2,
        bgcolor: "#1f1f1f",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={handleHamburger} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ color: "white" }}>
          Welcome, Admin
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" sx={{ color: "gray" }}>
          FH General Equipments
        </Typography>

        <IconButton onClick={handleSettingsClick} sx={{ color: "white" }}>
          <SettingsIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleSettingsClose}
          PaperProps={{
            sx: { bgcolor: "#2b2b2b", color: "white", borderRadius: 2 },
          }}
        >
          <MenuItem
            onMouseEnter={(e) => setCategoriesMenuEl(e.currentTarget)}
            onMouseLeave={() => setCategoriesMenuEl(null)}
            sx={{ justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CategoryIcon fontSize="small" />
              Categories
            </Box>
            <ArrowRightIcon fontSize="small" />

            <Menu
              anchorEl={categoriesMenuEl}
              open={openCategories}
              onClose={() => setCategoriesMenuEl(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: {
                  bgcolor: "#2b2b2b",
                  color: "white",
                  borderRadius: 2,
                  minWidth: 180,
                },
              }}
            >
              <MenuItem onClick={() => navigate("/admin/categories/list")}>
                <ListItemIcon>
                  <CategoryIcon sx={{ color: "white" }} fontSize="small" />
                </ListItemIcon>
                View Categories
              </MenuItem>

              <MenuItem onClick={() => navigate("/admin/categories/add")}>
                <ListItemIcon>
                  <AddCircleOutlineIcon sx={{ color: "white" }} fontSize="small" />
                </ListItemIcon>
                Add Category
              </MenuItem>
            </Menu>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleSettingsClose();
              navigate("/admin/change-settings");
            }}
          >
            <ListItemIcon>
              <PersonIcon sx={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
