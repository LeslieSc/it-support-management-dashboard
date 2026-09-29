import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/tickets"
            element={<TicketsPage />}
          />

          <Route
            path="/tickets/create"
            element={<CreateTicketPage />}
          />

          <Route
            path="/tickets/:id"
            element={<TicketDetailPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;