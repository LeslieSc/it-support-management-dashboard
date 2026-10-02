import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
} from "@mui/icons-material";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "../types/ticket";

import {
  getTickets,
} from "../services/ticketService";

function TicketsPage() {
  const navigate =
    useNavigate();

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        setLoading(true);

        setError("");

        const data =
          await getTickets();

        setTickets(data);
      } catch (error) {
        console.error(
          "Error loading tickets:",
          error
        );

        setError(
          "Could not load tickets."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  const filteredTickets =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return tickets.filter(
        (ticket) => {
          const matchesSearch =
            normalizedSearch === "" ||
            ticket.title
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            ticket.branch
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            ticket.category
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            (
              ticket.assignedTo
                ?.fullName ?? ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            (
              ticket.createdBy
                ?.fullName ?? ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesStatus =
            statusFilter === "" ||
            ticket.status ===
              statusFilter;

          const matchesPriority =
            priorityFilter === "" ||
            ticket.priority ===
              priorityFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
          );
        }
      );
    }, [
      tickets,
      search,
      statusFilter,
      priorityFilter,
    ]);

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
          alignItems: "center",
          marginBottom: 3,
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
            Tickets
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage IT support
            requests.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <AddIcon />
          }
          onClick={() =>
            navigate(
              "/tickets/create"
            )
          }
        >
          New Ticket
        </Button>
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

      <Paper
        sx={{
          padding: 3,
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Search"
            placeholder="Title, branch, category, creator or technician"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            sx={{
              minWidth: 280,
              flex: 1,
            }}
          />

          <FormControl
            sx={{
              minWidth: 180,
            }}
          >
            <InputLabel>
              Status
            </InputLabel>

            <Select
              value={
                statusFilter
              }
              label="Status"
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target
                    .value
                )
              }
            >
              <MenuItem
                value=""
              >
                All
              </MenuItem>

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
            sx={{
              minWidth: 180,
            }}
          >
            <InputLabel>
              Priority
            </InputLabel>

            <Select
              value={
                priorityFilter
              }
              label="Priority"
              onChange={(
                event
              ) =>
                setPriorityFilter(
                  event.target
                    .value
                )
              }
            >
              <MenuItem
                value=""
              >
                All
              </MenuItem>

              <MenuItem
                value="Low"
              >
                Low
              </MenuItem>

              <MenuItem
                value="Medium"
              >
                Medium
              </MenuItem>

              <MenuItem
                value="High"
              >
                High
              </MenuItem>

              <MenuItem
                value="Critical"
              >
                Critical
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                ID
              </TableCell>

              <TableCell>
                Title
              </TableCell>

              <TableCell>
                Branch
              </TableCell>

              <TableCell>
                Category
              </TableCell>

              <TableCell>
                Priority
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Overdue
              </TableCell>

              <TableCell>
                Created By
              </TableCell>

              <TableCell>
                Assigned To
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTickets.length ===
            0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map(
                (ticket) => (
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
                      #{ticket.id}
                    </TableCell>

                    <TableCell>
                      {ticket.title}
                    </TableCell>

                    <TableCell>
                      {ticket.branch}
                    </TableCell>

                    <TableCell>
                      {ticket.category}
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
                      {ticket.isOverdue ? (
                        <Chip
                          label="Overdue"
                          color="error"
                          size="small"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell>
                      {ticket.createdBy
                        ?.fullName ??
                        "Unknown"}
                    </TableCell>

                    <TableCell>
                      {ticket.assignedTo
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
    </Box>
  );
}

export default TicketsPage;