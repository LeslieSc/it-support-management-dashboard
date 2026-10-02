import {
  Box,
  Button,
  Divider,
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

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

const drawerWidth = 240;

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    logout,
  } = useAuth();

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

  const isSelected = (
    path: string
  ) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    if (path === "/tickets") {
      return (
        location.pathname === "/tickets" ||
        /^\/tickets\/\d+$/.test(
          location.pathname
        )
      );
    }

    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
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

        <Divider />

        <List>
          {menuItems.map(
            (item) => (
              <ListItemButton
                key={item.text}
                selected={isSelected(
                  item.path
                )}
                onClick={() =>
                  navigate(item.path)
                }
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                />
              </ListItemButton>
            )
          )}
        </List>

        <Box
          sx={{
            marginTop: "auto",
            padding: 2,
          }}
        >
          <Divider
            sx={{
              marginBottom: 2,
            }}
          />

          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
            }}
          >
            {user?.fullName}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              marginBottom: 0.5,
            }}
          >
            {user?.email}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              marginBottom: 2,
            }}
          >
            Role: {user?.role}
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Box>
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