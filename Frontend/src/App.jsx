import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import DonorDashboard from "./pages/dashboard/DonorDashboard";
import CreateDonation from "./pages/donor/CreateDonation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/donor" element={<DonorDashboard />} />
      <Route
        path="/donor/create"
        element={<CreateDonation />}
      />
    </Routes>
  );
}

export default App;