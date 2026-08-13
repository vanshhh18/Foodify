import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard.styles";

function DonorDashboard() {
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
          <span style={styles.userGreeting}>Welcome, {user?.full_name}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.hero}>
          <h2 style={styles.subtitle}>Share Food, Save Lives</h2>
          <p style={styles.description}>
            Your donations can make a real difference. Share surplus food with NGOs and communities in need.
          </p>
        </div>

        <div style={styles.buttonGrid}>
          <button
            onClick={() => navigate("/donor/create")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2E8B57")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            <div style={styles.buttonIcon}>➕</div>
            <div style={styles.buttonLabel}>Create Donation</div>
            <div style={styles.buttonDesc}>List a new food donation</div>
          </button>

          <button
            onClick={() => navigate("/donor/donations")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1976D2")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
          >
            <div style={styles.buttonIcon}>📋</div>
            <div style={styles.buttonLabel}>My Donations</div>
            <div style={styles.buttonDesc}>View and manage your donations</div>
          </button>

          <button
            onClick={() => alert("Profile page coming soon!")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#666")}
          >
            <div style={styles.buttonIcon}>👤</div>
            <div style={styles.buttonLabel}>My Profile</div>
            <div style={styles.buttonDesc}>View your profile details</div>
          </button>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>💡 How It Works</h3>
          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.step}>1</span>
              <p>Create a donation listing with details about your food</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.step}>2</span>
              <p>Use AI to auto-fill details by uploading an image</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.step}>3</span>
              <p>Verified NGOs browse and claim your donations</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.step}>4</span>
              <p>Track when donations are collected and received</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
