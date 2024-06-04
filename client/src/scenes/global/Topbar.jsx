import { LogoutOutlined } from "@mui/icons-material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  useTheme,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../../src/theme";
import { UserContext } from "../../contexts";

function Topbar({ isAuthorized }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { setIsAuthorized } = useContext(UserContext);
  const isAuthorizedProperty = isAuthorized;
  const navigate = useNavigate();
  const [anchorElement, setAnchorElement] = useState(null);
  const open = Boolean(anchorElement);

  function logout() {
    localStorage.removeItem("user");
    localStorage.setItem("isAuthorized", false);
    setIsAuthorized(false);
    navigate("/");
  }

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <>
      {!isAuthorizedProperty ? null : (
        <Box display="flex" justifyContent="space-between" p={2}>
          {/* SEARCH BAR */}
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
          >
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* ICONS */}
          <Box display="flex">
            <Stack direction="row" spacing={1}>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
              <IconButton
                id="notification-button"
                onClick={handleClick}
                aria-controls={open ? "notification-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <NotificationsOutlinedIcon />
              </IconButton>
              <IconButton onClick={() => navigate("/profileForm")}>
                <SettingsOutlinedIcon />
              </IconButton>
              <IconButton onClick={() => navigate("/profile")}>
                <PersonOutlinedIcon />
              </IconButton>
              <IconButton onClick={() => logout()}>
                <LogoutOutlined />
              </IconButton>
            </Stack>
            <Menu
              id="notification-menu"
              anchorEl={anchorElement}
              open={open}
              MenuListProps={{
                "aria-labelledby": "notification-button",
              }}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem onClick={handleClose}>Notification 1</MenuItem>
              <MenuItem onClick={handleClose}>Notification 2</MenuItem>
              <MenuItem onClick={handleClose}>Notification 3</MenuItem>
            </Menu>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Topbar;
