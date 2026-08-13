import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function NGODashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🍽️ FoodRescue AI</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.full_name}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.subtitle}>NGO Dashboard</h2>
        <p style={styles.description}>
          Find and claim available food donations to distribute to those in need.
        </p>

        <div style={styles.buttonGrid}>
          <button
            onClick={() => navigate("/ngo/available")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            <div style={styles.buttonIcon}>🔍</div>
            <div style={styles.buttonLabel}>Available Donations</div>
            <div style={styles.buttonDesc}>Browse available donations</div>
          </button>

          <button
            onClick={() => navigate("/ngo/claimed")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0276d4")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
          >
            <div style={styles.buttonIcon}>📦</div>
            <div style={styles.buttonLabel}>My Claims</div>
            <div style={styles.buttonDesc}>View claimed donations</div>
          </button>

          <button
            onClick={() => navigate("/profile")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#6c7a8b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#34495e")}
          >
            <div style={styles.buttonIcon}>👤</div>
            <div style={styles.buttonLabel}>NGO Profile</div>
            <div style={styles.buttonDesc}>View your NGO details</div>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "28px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  content: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  },
  subtitle: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "10px",
  },
  description: {
    color: "#666",
    fontSize: "16px",
    marginBottom: "40px",
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  actionButton: {
    padding: "30px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  buttonIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  buttonLabel: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  buttonDesc: {
    fontSize: "14px",
    opacity: 0.9,
  },
};

export default NGODashboard;
