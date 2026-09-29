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
  TextField,
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

import {
  getTicketById,
  updateTicket,
} from "../services/ticketService";

function TicketDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [status, setStatus] =
    useState<TicketStatus>("Open");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    async function loadTicket() {
      if (!id) {
        setError("Invalid ticket ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getTicketById(
          Number(id)
        );

        setTicket(data);
        setStatus(data.status);
        setAssignedTo(
          data.assignedTo ?? ""
        );
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

    loadTicket();
  }, [id]);

  const handleSave = async () => {
    if (!ticket) {
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
            assignedTo:
              assignedTo.trim() === ""
                ? null
                : assignedTo,
          }
        );

      setTicket(updatedTicket);

      setStatus(
        updatedTicket.status
      );

      setAssignedTo(
        updatedTicket.assignedTo ?? ""
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
    switch (currentStatus) {
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

  if (loading) {
    return (
      <Box
        sx={{
          padding: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert
          severity="error"
          sx={{ marginBottom: 3 }}
        >
          {error || "Ticket not found."}
        </Alert>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate("/tickets")
          }
        >
          Back to Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate("/tickets")
        }
        sx={{ marginBottom: 3 }}
      >
        Back to Tickets
      </Button>

      <Typography
        variant="h4"
        sx={{ fontWeight: "bold" }}
      >
        Ticket #{ticket.id}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ marginBottom: 4 }}
      >
        Technical incident details
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ marginBottom: 3 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ marginBottom: 3 }}
        >
          {success}
        </Alert>
      )}

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
          }}
        >
          <Chip
            label={ticket.priority}
            color={getPriorityColor(
              ticket.priority
            )}
          />

          <Chip
            label={ticket.status}
            color={getStatusColor(
              ticket.status
            )}
          />
        </Box>

        <Divider
          sx={{ marginBottom: 3 }}
        />

        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Description
        </Typography>

        <Typography
          sx={{ marginBottom: 3 }}
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
          sx={{ marginBottom: 3 }}
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
          sx={{ marginBottom: 4 }}
        >
          {ticket.category}
        </Typography>

        <Divider
          sx={{ marginBottom: 3 }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
          }}
        >
          Ticket Management
        </Typography>

        <FormControl
          fullWidth
          sx={{ marginBottom: 3 }}
        >
          <InputLabel>
            Status
          </InputLabel>

          <Select
            value={status}
            label="Status"
            onChange={(event) =>
              setStatus(
                event.target
                  .value as TicketStatus
              )
            }
          >
            <MenuItem value="Open">
              Open
            </MenuItem>

            <MenuItem value="In Progress">
              In Progress
            </MenuItem>

            <MenuItem value="Resolved">
              Resolved
            </MenuItem>

            <MenuItem value="Closed">
              Closed
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Assigned Technician"
          value={assignedTo}
          onChange={(event) =>
            setAssignedTo(
              event.target.value
            )
          }
          placeholder="Example: Leslie Sosa"
          fullWidth
          sx={{ marginBottom: 3 }}
        />

        <Button
          variant="contained"
          startIcon={
            saving ? undefined : (
              <SaveIcon />
            )
          }
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>

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
    </Box>
  );
}

export default TicketDetailPage;