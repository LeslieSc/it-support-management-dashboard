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
  InputAdornment,
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
  Clear as ClearIcon,
  Search as SearchIcon,
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
    search,
    setSearch,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] =
    useState("");

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
              ticket.createdBy
                ?.fullName ?? ""
            )
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

  const hasFilters =
    search !== "" ||
    statusFilter !== "" ||
    priorityFilter !== "";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
  };

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
          Tickets
        </Typography>

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
          sx={{
            borderRadius: 2,
            textTransform:
              "none",
            paddingX: 2.5,
          }}
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
          padding: {
            xs: 2,
            md: 3,
          },
          marginBottom: 3,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems:
              "center",
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
              flex: 1,
              minWidth: {
                xs: "100%",
                sm: 280,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment
                    position="start"
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl
            sx={{
              minWidth: {
                xs: "100%",
                sm: 180,
              },
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
                All statuses
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
              minWidth: {
                xs: "100%",
                sm: 180,
              },
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
                All priorities
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

          {hasFilters && (
            <Button
              startIcon={
                <ClearIcon />
              }
              onClick={
                clearFilters
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              Clear
            </Button>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            marginTop: 2,
          }}
        >
          {filteredTickets.length}{" "}
          of {tickets.length}{" "}
          tickets
        </Typography>
      </Paper>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 1000,
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  bgcolor:
                    "action.hover",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  ID
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Ticket
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Branch
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Category
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Priority
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Created By
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Assigned To
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTickets.length ===
              0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      paddingY: 8,
                    }}
                  >
                    <Typography
                      variant="h6"
                    >
                      No tickets found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map(
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
                        <Typography
                          color="text.secondary"
                        >
                          #
                          {
                            ticket.id
                          }
                        </Typography>
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

                        {ticket.isOverdue && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              fontWeight:
                                600,
                            }}
                          >
                            Overdue
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {
                          ticket.branch
                        }
                      </TableCell>

                      <TableCell>
                        {
                          ticket.category
                        }
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
                          variant="outlined"
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
                          .createdBy
                          ?.fullName ??
                          "Unknown"}
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
    </Box>
  );
}

export default TicketsPage;