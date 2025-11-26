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
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function TopBar({ isMobile, toggleMobile, collapsed, toggleDesktop }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleSettingsClick = (e) => setAnchorEl(e.currentTarget);
  const handleSettingsClose = () => setAnchorEl(null);

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
            onClick={() => {
              handleSettingsClose();
              navigate("/admin/settings");
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
