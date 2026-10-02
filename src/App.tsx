import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            element={
              <ProtectedRoute />
            }
          >
            <Route
              element={
                <AppLayout />
              }
            >
              <Route
                path="/"
                element={
                  <DashboardPage />
                }
              />

              <Route
                path="/tickets"
                element={
                  <TicketsPage />
                }
              />

              <Route
                path="/tickets/create"
                element={
                  <CreateTicketPage />
                }
              />

              <Route
                path="/tickets/:id"
                element={
                  <TicketDetailPage />
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;