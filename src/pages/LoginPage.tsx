import {
  useEffect,
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
  ConfirmationNumberOutlined as TicketIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

import {
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

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (
      isAuthenticated
    ) {
      navigate(
        "/",
        {
          replace: true,
        }
      );
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data =
        await login(
          email,
          password
        );

      setSession(data);

      navigate(
        "/",
        {
          replace: true,
        }
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        padding: 2,
        bgcolor:
          "background.default",
      }}
    >
      <Paper
        component="form"
        onSubmit={
          handleSubmit
        }
        sx={{
          width: "100%",
          maxWidth: 420,
          padding: {
            xs: 3,
            sm: 4,
          },
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems:
              "center",
            gap: 1.5,
            marginBottom: 4,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              borderRadius: 2,
              bgcolor:
                "primary.main",
              color:
                "primary.contrastText",
            }}
          >
            <TicketIcon />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            IT Support
          </Typography>
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

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(
            event
          ) =>
            setEmail(
              event.target.value
            )
          }
          autoComplete="email"
          fullWidth
          required
          sx={{
            marginBottom: 3,
          }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(
            event
          ) =>
            setPassword(
              event.target.value
            )
          }
          autoComplete="current-password"
          fullWidth
          required
          sx={{
            marginBottom: 3,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={
            loading
          }
          startIcon={
            loading
              ? undefined
              : (
                <LoginIcon />
              )
          }
          sx={{
            paddingY: 1.25,
            borderRadius: 2,
            textTransform:
              "none",
          }}
        >
          {loading ? (
            <CircularProgress
              size={22}
              color="inherit"
            />
          ) : (
            "Sign In"
          )}
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;