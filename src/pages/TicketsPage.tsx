import { useEffect, useState } from "react";

import {
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

import { useNavigate } from "react-router-dom";

import type { Ticket } from "../types/ticket";

import {
  getTickets,
} from "../services/ticketService";

function TicketsPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets();

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
    tickets.filter((ticket) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        ticket.title
          .toLowerCase()
          .includes(searchValue) ||
        ticket.branch
          .toLowerCase()
          .includes(searchValue) ||
        ticket.category
          .toLowerCase()
          .includes(searchValue) ||
        (ticket.assignedTo ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority ===
          priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

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
    status: string
  ):
    | "default"
    | "success"
    | "warning"
    | "info" => {
    switch (status) {
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

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 4,
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
            Manage technical support
            incidents.
          </Typography>
        </Box>

        <Button
          variant="contained"
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
        <Typography
          color="error"
          sx={{
            marginBottom: 3,
          }}
        >
          {error}
        </Typography>
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
            label="Search tickets"
            placeholder="Title, branch, category..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            sx={{
              minWidth: 300,
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
              value={statusFilter}
              label="Status"
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <MenuItem value="All">
                All
              </MenuItem>

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
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
            >
              <MenuItem value="All">
                All
              </MenuItem>

              <MenuItem value="Low">
                Low
              </MenuItem>

              <MenuItem value="Medium">
                Medium
              </MenuItem>

              <MenuItem value="High">
                High
              </MenuItem>

              <MenuItem value="Critical">
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
                <strong>ID</strong>
              </TableCell>

              <TableCell>
                <strong>
                  Title
                </strong>
              </TableCell>

              <TableCell>
                <strong>
                  Branch
                </strong>
              </TableCell>

              <TableCell>
                <strong>
                  Category
                </strong>
              </TableCell>

              <TableCell>
                <strong>
                  Priority
                </strong>
              </TableCell>

              <TableCell>
                <strong>
                  Status
                </strong>
              </TableCell>

              <TableCell>
                <strong>
                  Overdue
                </strong>
              </TableCell>

              <TableCell>
                <strong>
                  Assigned To
                </strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTickets.map(
              (ticket) => (
                <TableRow
                  key={ticket.id}
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
                    {ticket.assignedTo ??
                      "Unassigned"}
                  </TableCell>
                </TableRow>
              )
            )}

            {filteredTickets.length ===
              0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TicketsPage;