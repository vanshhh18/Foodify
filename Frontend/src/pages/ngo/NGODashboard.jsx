import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard.styles";

function NGODashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🍽️ FoodRescue AI</h1>
        <div style={styles.userInfo}>
          <span style={styles.userGreeting}>Welcome, {user?.organization_name || user?.full_name}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.hero}>
          <h2 style={styles.subtitle}>Help Your Community</h2>
          <p style={styles.description}>
            Browse available food donations and claim them for your organization. Track your impact with every donation received.
          </p>
        </div>

        <div style={styles.buttonGrid}>
          <button
            onClick={() => navigate("/ngo/available")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1976D2")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
          >
            <div style={styles.buttonIcon}>🔍</div>
            <div style={styles.buttonLabel}>Browse Donations</div>
            <div style={styles.buttonDesc}>Find available food to claim</div>
          </button>

          <button
            onClick={() => navigate("/ngo/claimed")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2E8B57")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            <div style={styles.buttonIcon}>🎯</div>
            <div style={styles.buttonLabel}>My Claims</div>
            <div style={styles.buttonDesc}>Track claimed donations</div>
          </button>

          <button
            onClick={() => alert("Profile page coming soon!")}
            style={styles.actionButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#666")}
          >
            <div style={styles.buttonIcon}>👤</div>
            <div style={styles.buttonLabel}>My Profile</div>
            <div style={styles.buttonDesc}>View organization details</div>
          </button>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>💡 How to Get Started</h3>
          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.step}>1</span>
              <p>Browse available food donations in your area</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.step}>2</span>
              <p>Claim donations that match your community's needs</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.step}>3</span>
              <p>Arrange pickup from donor's location</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.step}>4</span>
              <p>Mark donations as collected when received</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NGODashboard;
