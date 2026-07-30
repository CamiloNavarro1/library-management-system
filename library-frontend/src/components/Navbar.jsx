import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

function Navbar({ onMenuClick, drawerWidth }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <LocalLibraryIcon sx={{ mr: 1 }} />

        <Typography variant="h6" noWrap component="div">
          Sistema de Gestión de Biblioteca
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;