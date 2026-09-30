import {
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  login,
} from "../services/authService";

import {
  useAuth,
} from "../context/AuthContext";

function LoginPage() {
  const navigate =
    useNavigate();

  const {
    isAuthenticated,
    setSession,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const session =
        await login(
          email,
          password
        );

      setSession(session);

      navigate("/");
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(error.message);
      } else {
        setError(
          "Unable to log in."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        backgroundColor:
          "#f5f6f8",
        padding: 3,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 420,
          padding: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 1,
          }}
        >
          IT Support
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            marginBottom: 4,
          }}
        >
          Sign in to access the
          support management system.
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

        <Box
          component="form"
          onSubmit={
            handleSubmit
          }
          sx={{
            display: "flex",
            flexDirection:
              "column",
            gap: 3,
          }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;