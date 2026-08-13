import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Donor Pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import CreateDonation from "./pages/donor/CreateDonation";
import EditDonation from "./pages/donor/EditDonation";
import MyDonations from "./pages/donor/MyDonations";

// NGO/Volunteer Pages
import NGODashboard from "./pages/ngo/NGODashboard";
import VerificationPage from "./pages/ngo/VerificationPage";
import AvailableDonations from "./pages/ngo/AvailableDonations";
import ClaimedDonations from "./pages/ngo/ClaimedDonations";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Donor Routes */}
        <Route
          path="/donor"
          element={
            <ProtectedRoute requiredRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/create"
          element={
            <ProtectedRoute requiredRole="donor">
              <CreateDonation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donations"
          element={
            <ProtectedRoute requiredRole="donor">
              <MyDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donations/:id/edit"
          element={
            <ProtectedRoute requiredRole="donor">
              <EditDonation />
            </ProtectedRoute>
          }
        />

        {/* NGO Routes */}
        <Route
          path="/ngo"
          element={
            <ProtectedRoute requiredRole="ngo" requireVerified={true}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/verification"
          element={
            <ProtectedRoute requiredRole="ngo">
              <VerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/available"
          element={
            <ProtectedRoute requiredRole="ngo" requireVerified={true}>
              <AvailableDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/claimed"
          element={
            <ProtectedRoute requiredRole="ngo" requireVerified={true}>
              <ClaimedDonations />
            </ProtectedRoute>
          }
        />

        {/* Volunteer Routes (same as NGO) */}
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute requiredRole="volunteer" requireVerified={true}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/verification"
          element={
            <ProtectedRoute requiredRole="volunteer">
              <VerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/available"
          element={
            <ProtectedRoute requiredRole="volunteer" requireVerified={true}>
              <AvailableDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/claimed"
          element={
            <ProtectedRoute requiredRole="volunteer" requireVerified={true}>
              <ClaimedDonations />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;