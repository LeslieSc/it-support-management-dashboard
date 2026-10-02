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
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

import {
  ArrowBack as ArrowBackIcon,
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
    user?.role ===
      "TECHNICIAN";

  const [ticket, setTicket] =
    useState<Ticket | null>(
      null
    );

  const [
    history,
    setHistory,
  ] = useState<
    TicketHistory[]
  >([]);

  const [
    technicians,
    setTechnicians,
  ] = useState<User[]>([]);

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
  ] = useState<string>("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
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

  if (!ticket) {
    return (
      <Box
        sx={{
          padding: 4,
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
        >
          Back to Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
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
          marginBottom: 3,
        }}
      >
        Back to Tickets
      </Button>

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
        }}
      >
        Ticket #{ticket.id}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          marginBottom: 4,
        }}
      >
        Technical incident
        details
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

      <Paper
        sx={{
          padding: 4,
          maxWidth: 900,
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
          }}
        >
          {ticket.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            marginBottom: 3,
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

        <Divider
          sx={{
            marginBottom: 3,
          }}
        />

        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Description
        </Typography>

        <Typography
          sx={{
            marginBottom: 3,
          }}
        >
          {ticket.description}
        </Typography>

        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Branch
        </Typography>

        <Typography
          sx={{
            marginBottom: 3,
          }}
        >
          {ticket.branch}
        </Typography>

        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Category
        </Typography>

        <Typography
          sx={{
            marginBottom: 3,
          }}
        >
          {ticket.category}
        </Typography>

        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Created By
        </Typography>

        <Typography
          sx={{
            marginBottom: 4,
          }}
        >
          {ticket.createdBy
            ?.fullName ??
            "Unknown"}
        </Typography>

        {canManageTicket ? (
          <>
            <Divider
              sx={{
                marginBottom: 3,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  "bold",
                marginBottom: 3,
              }}
            >
              Ticket Management
            </Typography>

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
                value={status}
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
                Assigned Technician
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
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </>
        ) : (
          <>
            <Divider
              sx={{
                marginBottom: 3,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  "bold",
                marginBottom: 2,
              }}
            >
              Assignment
            </Typography>

            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Assigned Technician
            </Typography>

            <Typography>
              {ticket.assignedTo
                ?.fullName ??
                "Unassigned"}
            </Typography>
          </>
        )}

        <Divider
          sx={{
            marginTop: 4,
            marginBottom: 3,
          }}
        />

        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Created At
        </Typography>

        <Typography>
          {new Date(
            ticket.createdAt
          ).toLocaleString()}
        </Typography>
      </Paper>

      <Paper
        sx={{
          padding: 4,
          maxWidth: 900,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: 1,
          }}
        >
          Ticket History
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            marginBottom: 3,
          }}
        >
          Changes made to this
          ticket.
        </Typography>

        {history.length === 0 ? (
          <Typography
            color="text.secondary"
          >
            No changes have been
            recorded yet.
          </Typography>
        ) : (
          history.map(
            (
              historyItem,
              index
            ) => (
              <Box
                key={
                  historyItem.id
                }
              >
                <Box
                  sx={{
                    paddingTop: 2,
                    paddingBottom: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    {getHistoryTitle(
                      historyItem
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      marginTop: 1,
                    }}
                  >
                    {formatHistoryValue(
                      historyItem.oldValue
                    )}

                    {" → "}

                    {formatHistoryValue(
                      historyItem.newValue
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: 1,
                    }}
                  >
                    Changed by{" "}
                    <strong>
                      {historyItem
                        .changedBy
                        ?.fullName ??
                        "Unknown user"}
                    </strong>
                  </Typography>

                  {historyItem
                    .changedBy && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {
                        historyItem
                          .changedBy
                          .role
                      }
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      marginTop: 1,
                    }}
                  >
                    {new Date(
                      historyItem.changedAt
                    ).toLocaleString()}
                  </Typography>
                </Box>

                {index <
                  history.length -
                    1 && (
                  <Divider />
                )}
              </Box>
            )
          )
        )}
      </Paper>
    </Box>
  );
}

export default TicketDetailPage;