import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  CheckCircle as CheckCircleIcon,
  ConfirmationNumber as TicketIcon,
  PendingActions as PendingActionsIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

import {
  useNavigate,
} from "react-router-dom";

import {
  getDashboardStats,
} from "../services/dashboardService";

import type {
  DashboardStats,
} from "../services/dashboardService";

import {
  getTickets,
} from "../services/ticketService";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "../types/ticket";

import API_URL from "../config/api";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 1,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                marginBottom: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor:
                "action.hover",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const navigate =
    useNavigate();

  const [
    stats,
    setStats,
  ] =
    useState<DashboardStats | null>(
      null
    );

  const [
    tickets,
    setTickets,
  ] =
    useState<Ticket[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    apiOnline,
    setApiOnline,
  ] =
    useState(false);

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

        const [
          dashboardStats,
          ticketData,
        ] = await Promise.all([
          getDashboardStats(),
          getTickets(),
        ]);

        setStats(
          dashboardStats
        );

        setTickets(
          ticketData
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

  const recentTickets =
    useMemo(
      () =>
        tickets
          .slice()
          .sort(
            (
              first,
              second
            ) =>
              new Date(
                second.createdAt
              ).getTime() -
              new Date(
                first.createdAt
              ).getTime()
          )
          .slice(0, 5),
      [tickets]
    );

  const getPriorityColor = (
    priority: TicketPriority
  ):
    | "default"
    | "success"
    | "info"
    | "warning"
    | "error" => {
    switch (priority) {
      case "Low":
        return "success";

      case "Medium":
        return "info";

      case "High":
        return "warning";

      case "Critical":
        return "error";

      default:
        return "default";
    }
  };

  const getStatusColor = (
    status: TicketStatus
  ):
    | "default"
    | "success"
    | "info"
    | "warning" => {
    switch (status) {
      case "Open":
        return "warning";

      case "In Progress":
        return "info";

      case "Resolved":
        return "success";

      case "Closed":
        return "default";

      default:
        return "default";
    }
  };

  const getPercentage = (
    value: number
  ) => {
    if (
      !stats ||
      stats.totalTickets === 0
    ) {
      return 0;
    }

    return Math.round(
      (value /
        stats.totalTickets) *
        100
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: 2,
          flexWrap: "wrap",
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Dashboard
        </Typography>

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
          variant="outlined"
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
            sx={{
              marginBottom: 4,
            }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <StatCard
                title="Open Tickets"
                value={
                  stats.openTickets
                }
                icon={
                  <TicketIcon />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <StatCard
                title="In Progress"
                value={
                  stats.inProgressTickets
                }
                icon={
                  <PendingActionsIcon />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <StatCard
                title="Resolved"
                value={
                  stats.resolvedTickets
                }
                icon={
                  <CheckCircleIcon />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <StatCard
                title="Critical Issues"
                value={
                  stats.criticalTickets
                }
                icon={
                  <WarningIcon />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <StatCard
                title="Overdue Tickets"
                value={
                  stats.overdueTickets
                }
                icon={
                  <WarningIcon />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <StatCard
                title="Total Tickets"
                value={
                  stats.totalTickets
                }
                icon={
                  <TicketIcon />
                }
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={3}
          >
            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <Paper
                sx={{
                  padding: 3,
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    marginBottom: 3,
                  }}
                >
                  Tickets by Status
                </Typography>

                <Box
                  sx={{
                    marginBottom: 3,
                  }}
                >
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                    >
                      Open
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        stats.openTickets
                      }{" "}
                      (
                      {getPercentage(
                        stats.openTickets
                      )}
                      %)
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={getPercentage(
                      stats.openTickets
                    )}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    marginBottom: 3,
                  }}
                >
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                    >
                      In Progress
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        stats.inProgressTickets
                      }{" "}
                      (
                      {getPercentage(
                        stats.inProgressTickets
                      )}
                      %)
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={getPercentage(
                      stats.inProgressTickets
                    )}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>

                <Box>
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                    >
                      Resolved
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        stats.resolvedTickets
                      }{" "}
                      (
                      {getPercentage(
                        stats.resolvedTickets
                      )}
                      %)
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={getPercentage(
                      stats.resolvedTickets
                    )}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>

                <Divider
                  sx={{
                    marginTop: 4,
                    marginBottom: 3,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    Total
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {
                      stats.totalTickets
                    }
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid
              size={{
                xs: 12,
                lg: 8,
              }}
            >
              <Paper
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
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
                    Recent Tickets
                  </Typography>
                </Box>

                <Divider />

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          ID
                        </TableCell>

                        <TableCell>
                          Ticket
                        </TableCell>

                        <TableCell>
                          Priority
                        </TableCell>

                        <TableCell>
                          Status
                        </TableCell>

                        <TableCell>
                          Assigned To
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {recentTickets.length ===
                      0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={
                              5
                            }
                            align="center"
                          >
                            No tickets
                            available.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentTickets.map(
                          (
                            ticket
                          ) => (
                            <TableRow
                              key={
                                ticket.id
                              }
                              hover
                              onClick={() =>
                                navigate(
                                  `/tickets/${ticket.id}`
                                )
                              }
                              sx={{
                                cursor:
                                  "pointer",
                              }}
                            >
                              <TableCell>
                                #
                                {
                                  ticket.id
                                }
                              </TableCell>

                              <TableCell>
                                <Typography
                                  sx={{
                                    fontWeight:
                                      600,
                                  }}
                                >
                                  {
                                    ticket.title
                                  }
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {
                                    ticket.branch
                                  }
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label={
                                    ticket.priority
                                  }
                                  color={getPriorityColor(
                                    ticket.priority
                                  )}
                                  size="small"
                                />
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label={
                                    ticket.status
                                  }
                                  color={getStatusColor(
                                    ticket.status
                                  )}
                                  size="small"
                                />
                              </TableCell>

                              <TableCell>
                                {ticket
                                  .assignedTo
                                  ?.fullName ??
                                  "Unassigned"}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default DashboardPage;