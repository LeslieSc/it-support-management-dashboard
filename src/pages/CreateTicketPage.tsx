import {
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
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
  Send as SendIcon,
} from "@mui/icons-material";

import {
  useNavigate,
} from "react-router-dom";

import type {
  TicketCategory,
  TicketPriority,
} from "../types/ticket";

import {
  createTicket,
} from "../services/ticketService";

function CreateTicketPage() {
  const navigate =
    useNavigate();

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    branch,
    setBranch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] =
    useState<
      TicketCategory | ""
    >("");

  const [
    priority,
    setPriority,
  ] =
    useState<
      TicketPriority | ""
    >("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !title ||
      !description ||
      !branch ||
      !category ||
      !priority
    ) {
      setError(
        "Please complete all fields."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      await createTicket({
        title,
        description,
        branch,
        category,
        priority,
      });

      navigate(
        "/tickets"
      );
    } catch (error) {
      console.error(
        "Error creating ticket:",
        error
      );

      setError(
        "Could not create ticket."
      );
    } finally {
      setLoading(false);
    }
  };

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
          marginBottom: 3,
          textTransform:
            "none",
        }}
      >
        Back to Tickets
      </Button>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        New Ticket
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            marginBottom: 3,
            maxWidth: 760,
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        component="form"
        onSubmit={
          handleSubmit
        }
        sx={{
          padding: {
            xs: 2,
            md: 4,
          },
          borderRadius: 3,
          maxWidth: 760,
        }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(
            event
          ) =>
            setTitle(
              event.target.value
            )
          }
          fullWidth
          required
          sx={{
            marginBottom: 3,
          }}
        />

        <TextField
          label="Description"
          value={
            description
          }
          onChange={(
            event
          ) =>
            setDescription(
              event.target.value
            )
          }
          multiline
          minRows={5}
          fullWidth
          required
          sx={{
            marginBottom: 3,
          }}
        />

        <TextField
          label="Branch"
          value={branch}
          onChange={(
            event
          ) =>
            setBranch(
              event.target.value
            )
          }
          fullWidth
          required
          sx={{
            marginBottom: 3,
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            marginBottom: 4,
          }}
        >
          <FormControl
            fullWidth
            required
          >
            <InputLabel>
              Category
            </InputLabel>

            <Select
              value={category}
              label="Category"
              onChange={(
                event
              ) =>
                setCategory(
                  event.target
                    .value as TicketCategory
                )
              }
            >
              <MenuItem
                value="Network"
              >
                Network
              </MenuItem>

              <MenuItem
                value="Hardware"
              >
                Hardware
              </MenuItem>

              <MenuItem
                value="Software"
              >
                Software
              </MenuItem>

              <MenuItem
                value="POS"
              >
                POS
              </MenuItem>

              <MenuItem
                value="Access"
              >
                Access
              </MenuItem>

              <MenuItem
                value="Other"
              >
                Other
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            required
          >
            <InputLabel>
              Priority
            </InputLabel>

            <Select
              value={priority}
              label="Priority"
              onChange={(
                event
              ) =>
                setPriority(
                  event.target
                    .value as TicketPriority
                )
              }
            >
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

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              navigate(
                "/tickets"
              )
            }
            disabled={
              loading
            }
            sx={{
              textTransform:
                "none",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={
              loading
                ? undefined
                : (
                  <SendIcon />
                )
            }
            disabled={
              loading
            }
            sx={{
              textTransform:
                "none",
              borderRadius: 2,
            }}
          >
            {loading
              ? "Creating..."
              : "Create Ticket"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreateTicketPage;