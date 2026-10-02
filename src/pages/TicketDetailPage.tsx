import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

import {
  ArrowBack as ArrowBackIcon,
  AssignmentInd as AssignmentIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import type {
  Ticket,
  TicketStatus,
} from "../types/ticket";

import type {
  TicketHistory,
} from "../types/ticketHistory";

import type {
  User,
} from "../types/auth";

import {
  getTicketById,
  getTicketHistory,
  updateTicket,
} from "../services/ticketService";

import {
  getTechnicians,
} from "../services/userService";

import {
  useAuth,
} from "../context/AuthContext";

function TicketDetailPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const { user } =
    useAuth();

  const canManageTicket =
    user?.role === "ADMIN" ||
    user?.role === "TECHNICIAN";

  const [
    ticket,
    setTicket,
  ] =
    useState<Ticket | null>(
      null
    );

  const [
    history,
    setHistory,
  ] =
    useState<TicketHistory[]>(
      []
    );

  const [
    technicians,
    setTechnicians,
  ] =
    useState<User[]>([]);

  const [
    status,
    setStatus,
  ] =
    useState<TicketStatus>(
      "Open"
    );

  const [
    assignedToUserId,
    setAssignedToUserId,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const loadHistory =
    async (
      ticketId: number
    ) => {
      const historyData =
        await getTicketHistory(
          ticketId
        );

      setHistory(
        historyData
      );
    };

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError(
          "Invalid ticket ID."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const ticketId =
          Number(id);

        const ticketData =
          await getTicketById(
            ticketId
          );

        setTicket(
          ticketData
        );

        setStatus(
          ticketData.status
        );

        setAssignedToUserId(
          ticketData.assignedTo
            ? String(
                ticketData
                  .assignedTo.id
              )
            : ""
        );

        await loadHistory(
          ticketId
        );

        if (
          canManageTicket
        ) {
          const technicianData =
            await getTechnicians();

          setTechnicians(
            technicianData
          );
        }
      } catch (error) {
        console.error(
          "Error loading ticket:",
          error
        );

        setError(
          "Could not load ticket."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [
    id,
    canManageTicket,
  ]);

  const handleSave =
    async () => {
      if (
        !ticket ||
        !canManageTicket
      ) {
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        const updatedTicket =
          await updateTicket(
            ticket.id,
            {
              status,

              assignedToUserId:
                assignedToUserId ===
                ""
                  ? null
                  : Number(
                      assignedToUserId
                    ),
            }
          );

        setTicket(
          updatedTicket
        );

        setStatus(
          updatedTicket.status
        );

        setAssignedToUserId(
          updatedTicket.assignedTo
            ? String(
                updatedTicket
                  .assignedTo.id
              )
            : ""
        );

        await loadHistory(
          updatedTicket.id
        );

        setSuccess(
          "Ticket updated successfully."
        );
      } catch (error) {
        console.error(
          "Error updating ticket:",
          error
        );

        setError(
          "Could not update the ticket."
        );
      } finally {
        setSaving(false);
      }
    };

  const getPriorityColor = (
    priority: string
  ):
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info" => {
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
    currentStatus: string
  ):
    | "default"
    | "success"
    | "warning"
    | "info" => {
    switch (
      currentStatus
    ) {
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

  const getHistoryTitle = (
    item: TicketHistory
  ) => {
    if (
      item.fieldName ===
      "status"
    ) {
      return "Status changed";
    }

    if (
      item.fieldName ===
      "assignedTo"
    ) {
      return "Technician assignment changed";
    }

    return "Ticket updated";
  };

  const formatHistoryValue = (
    value: string | null
  ) => {
    if (
      value === null ||
      value.trim() === ""
    ) {
      return "Unassigned";
    }

    return value;
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleString();
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

  if (!ticket) {
    return (
      <Box
        sx={{
          padding: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Alert
          severity="error"
          sx={{
            marginBottom: 3,
          }}
        >
          {error ||
            "Ticket not found."}
        </Alert>

        <Button
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            navigate(
              "/tickets"
            )
          }
          sx={{
            textTransform:
              "none",
          }}
        >
          Back to Tickets
        </Button>
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
      <Button
        startIcon={
          <ArrowBackIcon />
        }
        onClick={() =>
          navigate(
            "/tickets"
          )
        }
        sx={{
          textTransform:
            "none",
          marginBottom: 3,
        }}
      >
        Back to Tickets
      </Button>

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
          Ticket #{ticket.id}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={
              ticket.priority
            }
            color={getPriorityColor(
              ticket.priority
            )}
            variant="outlined"
          />

          <Chip
            label={
              ticket.status
            }
            color={getStatusColor(
              ticket.status
            )}
          />

          {ticket.isOverdue && (
            <Chip
              label="Overdue"
              color="error"
            />
          )}
        </Box>
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

      {success && (
        <Alert
          severity="success"
          sx={{
            marginBottom: 3,
          }}
        >
          {success}
        </Alert>
      )}

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
            lg: 8,
          }}
        >
          <Paper
            sx={{
              padding: {
                xs: 2,
                md: 4,
              },
              borderRadius: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              {ticket.title}
            </Typography>

            <Divider
              sx={{
                marginBottom: 3,
              }}
            />

            <Typography
              variant="overline"
              color="text.secondary"
            >
              Description
            </Typography>

            <Typography
              sx={{
                marginTop: 0.5,
                marginBottom: 4,
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {ticket.description}
            </Typography>

            <Grid
              container
              spacing={3}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  Branch
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 600,
                    marginTop: 0.5,
                  }}
                >
                  {ticket.branch}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  Category
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 600,
                    marginTop: 0.5,
                  }}
                >
                  {ticket.category}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  Created By
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1,
                    marginTop: 0.5,
                  }}
                >
                  <PersonIcon
                    fontSize="small"
                    color="action"
                  />

                  <Typography
                    sx={{
                      fontWeight:
                        600,
                    }}
                  >
                    {ticket.createdBy
                      ?.fullName ??
                      "Unknown"}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  Created At
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 600,
                    marginTop: 0.5,
                  }}
                >
                  {formatDate(
                    ticket.createdAt
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Paper
            sx={{
              padding: {
                xs: 2,
                md: 3,
              },
              borderRadius: 3,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 1,
                marginBottom: 3,
              }}
            >
              <AssignmentIcon />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Assignment
              </Typography>
            </Box>

            {canManageTicket ? (
              <>
                <FormControl
                  fullWidth
                  sx={{
                    marginBottom: 3,
                  }}
                >
                  <InputLabel>
                    Status
                  </InputLabel>

                  <Select
                    value={
                      status
                    }
                    label="Status"
                    onChange={(
                      event
                    ) =>
                      setStatus(
                        event.target
                          .value as TicketStatus
                      )
                    }
                  >
                    <MenuItem
                      value="Open"
                    >
                      Open
                    </MenuItem>

                    <MenuItem
                      value="In Progress"
                    >
                      In Progress
                    </MenuItem>

                    <MenuItem
                      value="Resolved"
                    >
                      Resolved
                    </MenuItem>

                    <MenuItem
                      value="Closed"
                    >
                      Closed
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{
                    marginBottom: 3,
                  }}
                >
                  <InputLabel>
                    Assigned
                    Technician
                  </InputLabel>

                  <Select
                    value={
                      assignedToUserId
                    }
                    label="Assigned Technician"
                    onChange={(
                      event
                    ) =>
                      setAssignedToUserId(
                        event.target
                          .value
                      )
                    }
                  >
                    <MenuItem
                      value=""
                    >
                      Unassigned
                    </MenuItem>

                    {technicians.map(
                      (
                        technician
                      ) => (
                        <MenuItem
                          key={
                            technician.id
                          }
                          value={String(
                            technician.id
                          )}
                        >
                          {
                            technician.fullName
                          }
                          {" — "}
                          {
                            technician.role
                          }
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={
                    saving
                      ? undefined
                      : (
                        <SaveIcon />
                      )
                  }
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving
                  }
                  sx={{
                    textTransform:
                      "none",
                    borderRadius: 2,
                    paddingY: 1.2,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  Assigned
                  Technician
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 600,
                    marginTop: 0.5,
                    marginBottom: 3,
                  }}
                >
                  {ticket.assignedTo
                    ?.fullName ??
                    "Unassigned"}
                </Typography>

                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  Status
                </Typography>

                <Box
                  sx={{
                    marginTop: 1,
                  }}
                >
                  <Chip
                    label={
                      ticket.status
                    }
                    color={getStatusColor(
                      ticket.status
                    )}
                  />
                </Box>
              </>
            )}

            {canManageTicket && (
              <>
                <Divider
                  sx={{
                    marginY: 3,
                  }}
                />

                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  Current Technician
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1,
                    marginTop: 1,
                  }}
                >
                  <PersonIcon
                    fontSize="small"
                    color="action"
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontWeight:
                          600,
                      }}
                    >
                      {ticket.assignedTo
                        ?.fullName ??
                        "Unassigned"}
                    </Typography>

                    {ticket.assignedTo && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {
                          ticket.assignedTo
                            .role
                        }
                      </Typography>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          padding: {
            xs: 2,
            md: 4,
          },
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems:
              "center",
            gap: 1,
            marginBottom: 4,
          }}
        >
          <HistoryIcon />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Ticket History
          </Typography>
        </Box>

        {history.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              paddingY: 6,
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: 42,
                marginBottom: 1,
              }}
              color="disabled"
            />

            <Typography
              variant="h6"
            >
              No history yet
            </Typography>
          </Box>
        ) : (
          <Box>
            {history.map(
              (
                historyItem,
                index
              ) => (
                <Box
                  key={
                    historyItem.id
                  }
                  sx={{
                    display: "flex",
                    gap: 2,
                    position:
                      "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      flexShrink: 0,
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      position:
                        "relative",
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius:
                          "50%",
                        bgcolor:
                          "primary.main",
                        marginTop:
                          1.2,
                        zIndex: 1,
                      }}
                    />

                    {index <
                      history.length -
                        1 && (
                      <Box
                        sx={{
                          position:
                            "absolute",
                          top: 20,
                          bottom: 0,
                          width:
                            "2px",
                          bgcolor:
                            "divider",
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      paddingBottom:
                        index ===
                        history.length -
                          1
                          ? 0
                          : 4,
                    }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        padding: {
                          xs: 2,
                          md: 2.5,
                        },
                        borderRadius: 2,
                        bgcolor:
                          "background.default",
                      }}
                    >
                      <Box
                        sx={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: 2,
                          flexWrap:
                            "wrap",
                          marginBottom: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight:
                              700,
                          }}
                        >
                          {getHistoryTitle(
                            historyItem
                          )}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(
                            historyItem.changedAt
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1,
                          flexWrap:
                            "wrap",
                          marginBottom: 2,
                        }}
                      >
                        <Chip
                          label={formatHistoryValue(
                            historyItem.oldValue
                          )}
                          size="small"
                          variant="outlined"
                        />

                        <Typography
                          color="text.secondary"
                        >
                          →
                        </Typography>

                        <Chip
                          label={formatHistoryValue(
                            historyItem.newValue
                          )}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1,
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <PersonIcon
                          fontSize="small"
                          color="action"
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              600,
                          }}
                        >
                          {historyItem
                            .changedBy
                            ?.fullName ??
                            "Unknown user"}
                        </Typography>

                        {historyItem
                          .changedBy && (
                          <Chip
                            label={
                              historyItem
                                .changedBy
                                .role
                            }
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              )
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default TicketDetailPage;