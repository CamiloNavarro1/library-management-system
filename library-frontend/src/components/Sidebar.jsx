import {
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    label: "Usuarios",
    path: "/usuarios",
    icon: <PeopleIcon />,
  },
  {
    label: "Libros",
    path: "/libros",
    icon: <MenuBookIcon />,
  },
  {
    label: "Préstamos",
    path: "/prestamos",
    icon: <SwapHorizIcon />,
  },
];

function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          Biblioteca
        </Typography>
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              mb: 0.5,
              borderRadius: 2,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;