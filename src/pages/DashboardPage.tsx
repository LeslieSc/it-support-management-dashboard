import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  CheckCircle as CheckCircleIcon,
  ConfirmationNumber as TicketIcon,
  PendingActions as PendingActionsIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

import {
  getDashboardStats,
} from "../services/dashboardService";

import type {
  DashboardStats,
} from "../services/dashboardService";

import API_URL from "../config/api";

function DashboardPage() {
  const [
    stats,
    setStats,
  ] = useState<DashboardStats | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    apiOnline,
    setApiOnline,
  ] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        try {
          const healthResponse =
            await fetch(
              `${API_URL}/health`
            );

          setApiOnline(
            healthResponse.ok
          );
        } catch {
          setApiOnline(false);
        }

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

        setError(
          "Could not load dashboard information."
        );
      } finally {
        setLoading(false);
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
          alignItems:
            "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
            }}
          >
            Dashboard
          </Typography>

          <Typography
            color="text.secondary"
          >
            IT support overview
            and ticket statistics.
          </Typography>
        </Box>

        <Chip
          label={
            apiOnline
              ? "API Online"
              : "API Offline"
          }
          color={
            apiOnline
              ? "success"
              : "error"
          }
        />
      </Box>

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

      {stats && (
        <>
          <Grid
            container
            spacing={3}
          >
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                      >
                        Open Tickets
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight:
                            "bold",
                          marginTop: 1,
                        }}
                      >
                        {
                          stats.openTickets
                        }
                      </Typography>
                    </Box>

                    <TicketIcon
                      fontSize="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                      >
                        In Progress
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight:
                            "bold",
                          marginTop: 1,
                        }}
                      >
                        {
                          stats.inProgressTickets
                        }
                      </Typography>
                    </Box>

                    <PendingActionsIcon
                      fontSize="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                      >
                        Resolved
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight:
                            "bold",
                          marginTop: 1,
                        }}
                      >
                        {
                          stats.resolvedTickets
                        }
                      </Typography>
                    </Box>

                    <CheckCircleIcon
                      fontSize="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                      >
                        Critical Issues
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight:
                            "bold",
                          marginTop: 1,
                        }}
                      >
                        {
                          stats.criticalTickets
                        }
                      </Typography>
                    </Box>

                    <WarningIcon
                      fontSize="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                      >
                        Overdue Tickets
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight:
                            "bold",
                          marginTop: 1,
                        }}
                      >
                        {
                          stats.overdueTickets
                        }
                      </Typography>
                    </Box>

                    <WarningIcon
                      fontSize="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box>
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
                          marginTop: 1,
                        }}
                      >
                        {
                          stats.totalTickets
                        }
                      </Typography>
                    </Box>

                    <TicketIcon
                      fontSize="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default DashboardPage;