import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import { ToastProvider } from "./components/ToastProvider";
import Home from "./pages/Home";
import Residents from "./pages/Residents";
import Staff from "./pages/Staff";
import Schedule from "./pages/Schedule";
import Services from "./pages/Services";
import Facilities from "./pages/Facilities";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import Navbar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/services" element={<Services />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </Router>
  );
};

export default App;
