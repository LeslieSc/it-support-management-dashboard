import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import type {
  TicketCategory,
  TicketPriority,
} from "../types/ticket";

import { createTicket } from "../services/ticketService";

function CreateTicketPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("");

  const [category, setCategory] =
    useState<TicketCategory | "">("");

  const [priority, setPriority] =
    useState<TicketPriority | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!category || !priority) {
      setError(
        "Please select a category and priority."
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

      navigate("/tickets");
    } catch (error) {
      console.error(
        "Error creating ticket:",
        error
      );

      setError(
        "Could not create the ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold" }}
      >
        Create Ticket
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ marginBottom: 4 }}
      >
        Report a new technical incident.
      </Typography>

      <Paper
        sx={{
          padding: 4,
          maxWidth: 800,
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{ marginBottom: 3 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
            multiline
            rows={4}
            fullWidth
          />

          <TextField
            label="Branch"
            value={branch}
            onChange={(event) =>
              setBranch(event.target.value)
            }
            placeholder="Example: Chihuahua 001"
            required
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel>
              Category
            </InputLabel>

            <Select
              value={category}
              label="Category"
              onChange={(event) =>
                setCategory(
                  event.target
                    .value as TicketCategory
                )
              }
            >
              <MenuItem value="Network">
                Network
              </MenuItem>

              <MenuItem value="Hardware">
                Hardware
              </MenuItem>

              <MenuItem value="Software">
                Software
              </MenuItem>

              <MenuItem value="POS">
                POS
              </MenuItem>

              <MenuItem value="Access">
                Access
              </MenuItem>

              <MenuItem value="Other">
                Other
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>
              Priority
            </InputLabel>

            <Select
              value={priority}
              label="Priority"
              onChange={(event) =>
                setPriority(
                  event.target
                    .value as TicketPriority
                )
              }
            >
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

          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Create Ticket"
              )}
            </Button>

            <Button
              variant="outlined"
              disabled={loading}
              onClick={() =>
                navigate("/tickets")
              }
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreateTicketPage;