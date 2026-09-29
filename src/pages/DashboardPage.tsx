import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  ConfirmationNumber as TicketIcon,
  PendingActions as ProgressIcon,
  CheckCircle as ResolvedIcon,
  Warning as CriticalIcon,
} from "@mui/icons-material";

import {
  getDashboardStats,
} from "../services/dashboardService";

import type {
  DashboardStats,
} from "../services/dashboardService";

function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  const [apiStatus, setApiStatus] =
    useState("Checking...");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const healthResponse =
          await fetch(
            "http://localhost:3000/api/health"
          );

        if (
          !healthResponse.ok
        ) {
          throw new Error(
            "API health check failed"
          );
        }

        const healthData =
          await healthResponse.json();

        setApiStatus(
          healthData.status === "ok"
            ? "Online"
            : "Offline"
        );

        const dashboardStats =
          await getDashboardStats();

        setStats(
          dashboardStats
        );
      } catch (error) {
        console.error(
          "Error loading dashboard:",
          error
        );

        setApiStatus(
          "Offline"
        );

        setError(
          "Could not load dashboard information."
        );
      } finally {
        setLoading(
          false
        );
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          padding: 4,
          display: "flex",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    {
      title:
        "Open Tickets",
      value:
        stats?.openTickets ??
        0,
      icon:
        <TicketIcon />,
    },
    {
      title:
        "In Progress",
      value:
        stats?.inProgressTickets ??
        0,
      icon:
        <ProgressIcon />,
    },
    {
      title:
        "Resolved",
      value:
        stats?.resolvedTickets ??
        0,
      icon:
        <ResolvedIcon />,
    },
    {
      title:
        "Critical Issues",
      value:
        stats?.criticalTickets ??
        0,
      icon:
        <CriticalIcon />,
    },
    {
      title:
        "Overdue Tickets",
      value:
        stats?.overdueTickets ??
        0,
      icon:
        <CriticalIcon />,
    },
  ];

  return (
    <Box
      sx={{
        padding: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
        }}
      >
        IT Support Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          marginBottom: 2,
        }}
      >
        Monitor and manage
        technical support
        incidents.
      </Typography>

      <Typography
        variant="body2"
        color={
          apiStatus ===
          "Online"
            ? "success.main"
            : "error.main"
        }
        sx={{
          marginBottom: 4,
          fontWeight: "bold",
        }}
      >
        API Status:{" "}
        {apiStatus}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            marginBottom: 3,
          }}
        >
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={3}
        sx={{
          marginBottom: 4,
        }}
      >
        {cards.map(
          (card) => (
            <Grid
              key={
                card.title
              }
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card
                sx={{
                  height:
                    "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom: 2,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                    >
                      {
                        card.title
                      }
                    </Typography>

                    {
                      card.icon
                    }
                  </Box>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    {
                      card.value
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      <Card>
        <CardContent>
          <Typography
            color="text.secondary"
          >
            Total Tickets
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight:
                "bold",
            }}
          >
            {stats?.totalTickets ??
              0}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardPage;