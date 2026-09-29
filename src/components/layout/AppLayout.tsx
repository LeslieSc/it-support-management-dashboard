import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  AddCircleOutlined as AddCircleOutlineIcon,
} from "@mui/icons-material";


import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
    },
    {
      text: "Tickets",
      icon: <ConfirmationNumberIcon />,
      path: "/tickets",
    },
    {
      text: "Create Ticket",
      icon: <AddCircleOutlineIcon />,
      path: "/tickets/create",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
            }}
          >
            IT Support
          </Typography>
        </Toolbar>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "#f5f6f8",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;