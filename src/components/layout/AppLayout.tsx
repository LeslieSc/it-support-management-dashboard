import {
  useState,
} from "react";

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  AddCircleOutlined as AddCircleOutlineIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

const drawerWidth =
  240;

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon:
      <DashboardIcon />,
  },
  {
    label: "Tickets",
    path: "/tickets",
    icon:
      <ConfirmationNumberIcon />,
  },
  {
    label: "Create Ticket",
    path: "/tickets/create",
    icon:
      <AddCircleOutlineIcon />,
  },
];

function AppLayout() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const theme =
    useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down(
        "md"
      )
    );

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();

    navigate(
      "/login"
    );
  };

  const handleNavigate = (
    path: string
  ) => {
    navigate(path);

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isSelected = (
    path: string
  ) => {
    if (path === "/") {
      return (
        location.pathname ===
        "/"
      );
    }

    if (
      path ===
      "/tickets"
    ) {
      return (
        location.pathname ===
          "/tickets" ||
        /^\/tickets\/\d+$/.test(
          location.pathname
        )
      );
    }

    return (
      location.pathname ===
      path
    );
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection:
          "column",
      }}
    >
      <Box
        sx={{
          padding: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          IT Support
        </Typography>
      </Box>

      <Divider />

      <List
        sx={{
          padding: 2,
        }}
      >
        {menuItems.map(
          (item) => (
            <ListItemButton
              key={
                item.path
              }
              selected={isSelected(
                item.path
              )}
              onClick={() =>
                handleNavigate(
                  item.path
                )
              }
              sx={{
                borderRadius: 2,
                marginBottom: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  item.label
                }
              />
            </ListItemButton>
          )
        )}
      </List>

      <Box
        sx={{
          flexGrow: 1,
        }}
      />

      <Divider />

      <Box
        sx={{
          padding: 2.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
          }}
          noWrap
        >
          {user?.fullName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{
            marginBottom: 0.5,
          }}
        >
          {user?.email}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {user?.role}
        </Typography>

        <Button
          fullWidth
          startIcon={
            <LogoutIcon />
          }
          onClick={
            handleLogout
          }
          sx={{
            marginTop: 2,
            justifyContent:
              "flex-start",
            textTransform:
              "none",
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width:
              drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper":
              {
                width:
                  drawerWidth,
                boxSizing:
                  "border-box",
              },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={
            mobileOpen
          }
          onClose={() =>
            setMobileOpen(
              false
            )
          }
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper":
              {
                width:
                  drawerWidth,
                boxSizing:
                  "border-box",
              },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          bgcolor:
            "background.default",
        }}
      >
        {isMobile && (
          <Box
            sx={{
              height: 64,
              display: "flex",
              alignItems:
                "center",
              paddingX: 2,
              borderBottom: 1,
              borderColor:
                "divider",
              bgcolor:
                "background.paper",
            }}
          >
            <IconButton
              onClick={() =>
                setMobileOpen(
                  true
                )
              }
              edge="start"
            >
              <MenuIcon />
            </IconButton>

            <Typography
              sx={{
                marginLeft: 1,
                fontWeight: 700,
              }}
            >
              IT Support
            </Typography>
          </Box>
        )}

        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;