import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard.styles";
import { useState, useEffect } from "react";
import { getMyDonations } from "../../api/donationApi";

function DonorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [impactStats, setImpactStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    peopleHelped: 0
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch donations and calculate impact stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      
      try {
        // Get user's donations
        const userDonations = await getMyDonations();
        setRecentDonations(userDonations.slice(0, 5)); // Show only recent 5
        
        // Calculate impact statistics
        const total = userDonations.length;
        const active = userDonations.filter(d => d.status === "PENDING").length;
        const completed = userDonations.filter(d => d.status === "COMPLETED").length;
        
        // Estimate people helped (rough calculation based on quantity)
        const peopleHelped = userDonations.reduce((sum, donation) => {
          // Simple estimation: quantity / average serving size
          const quantity = parseFloat(donation.quantity) || 0;
          return sum + Math.max(1, Math.floor(quantity / 5)); // Assume 5 servings per unit
        }, 0);
        
        setImpactStats({
          totalDonations: total,
          activeDonations: active,
          completedDonations: completed,
          peopleHelped: peopleHelped
        });
        
      } catch (err) {
        const message = err.response?.data?.detail || "Failed to load dashboard data";
        setError(message);
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#ff9800',
      'CLAIMED': '#2196F3', 
      'COMPLETED': '#4CAF50'
    };
    return colors[status] || '#999999';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'food': '🍱',
      'books': '📚',
      'clothes': '👕'
    };
    return icons[category] || '📦';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🍽️ FoodRescue AI</h1>
        <div style={styles.userInfo}>
          <span style={styles.userGreeting}>Welcome, {user?.full_name}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div style={styles.hero}>
          <h2 style={styles.subtitle}>Make a difference, one donation at a time.</h2>
          <p style={styles.description}>
            Welcome {user?.full_name}! Your donations can reach people and organizations who need them most. 
            Together we're building a more compassionate community through food rescue, book sharing, and clothing generosity.
          </p>
          <button
            onClick={() => navigate("/donor/create")}
            style={styles.primaryBtn}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#2E8B57";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#4CAF50";
              e.target.style.transform = "none";
              e.target.style.boxShadow = "none";
            }}
          >
            + Create Donation
          </button>
        </div>

        {/* Impact Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Impact</h3>
          <div style={styles.twoColumn}>
            <div style={styles.card}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2E8B57" }}>Total Donations</h4>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#333" }}>
                {loading ? "..." : impactStats.totalDonations}
              </div>
              <p style={{ margin: "10px 0 0 0", color: "#666", fontSize: "14px" }}>Items shared with community</p>
            </div>
            <div style={styles.card}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2196F3" }}>Active Donations</h4>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#333" }}>
                {loading ? "..." : impactStats.activeDonations}
              </div>
              <p style={{ margin: "10px 0 0 0", color: "#666", fontSize: "14px" }}>Awaiting pickup</p>
            </div>
            <div style={styles.card}>
              <h4 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>Completed</h4>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#333" }}>
                {loading ? "..." : impactStats.completedDonations}
              </div>
              <p style={{ margin: "10px 0 0 0", color: "#666", fontSize: "14px" }}>Successfully delivered</p>
            </div>
            <div style={styles.card}>
              <h4 style={{ margin: "0 0 10px 0", color: "#FF6B6B" }}>People Helped</h4>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#333" }}>
                {loading ? "..." : impactStats.peopleHelped}
              </div>
              <p style={{ margin: "10px 0 0 0", color: "#666", fontSize: "14px" }}>Lives impacted</p>
            </div>
          </div>
        </div>

        {/* Donation Categories */}
        <div style={{ marginTop: "50px" }}>
          <h3 style={styles.cardTitle}>What would you like to give?</h3>
          <div style={styles.buttonGrid}>
            <button
              onClick={() => navigate("/donor/create")}
              style={styles.categoryCard}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>🍱</div>
              <h4 style={{ margin: "0 0 10px 0", color: "#2E8B57", fontSize: "20px" }}>Food</h4>
              <p style={{ margin: 0, color: "#666", lineHeight: "1.5" }}>Share surplus meals and groceries with those in need.</p>
            </button>

            <button
              onClick={() => navigate("/donor/create")}
              style={styles.categoryCard}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>📚</div>
              <h4 style={{ margin: "0 0 10px 0", color: "#4A90E2", fontSize: "20px" }}>Books</h4>
              <p style={{ margin: 0, color: "#666", lineHeight: "1.5" }}>Give books a second life and inspire learning.</p>
            </button>

            <button
              onClick={() => navigate("/donor/create")}
              style={styles.categoryCard}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "none";
                e.target.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>👕</div>
              <h4 style={{ margin: "0 0 10px 0", color: "#E91E63", fontSize: "20px" }}>Clothes</h4>
              <p style={{ margin: 0, color: "#666", lineHeight: "1.5" }}>Pass on clothes that can help someone else stay warm.</p>
            </button>
          </div>
        </div>

        {/* Recent Donations */}
        <div style={{ marginTop: "60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={styles.cardTitle}>Recent Donations</h3>
            <button
              onClick={() => navigate("/donor/donations")}
              style={styles.smallBtn}
              onMouseOver={(e) => {
                e.target.style.opacity = "0.9";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = "1";
                e.target.style.transform = "none";
              }}
            >
              View All Donations
            </button>
          </div>
          
          {loading ? (
            <div style={styles.loadingMessage}>Loading your recent donations... ⏳</div>
          ) : recentDonations.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3>No donations yet</h3>
              <p style={{ color: "#666", marginBottom: "20px" }}>Start sharing food with those in need!</p>
              <button
                onClick={() => navigate("/donor/create")}
                style={styles.primaryBtn}
              >
                Create Your First Donation
              </button>
            </div>
          ) : (
            <div style={styles.list}>
              {recentDonations.map((donation) => (
                <div key={donation.id} style={styles.listItem}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "24px" }}>{getCategoryIcon(donation.category)}</span>
                        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{donation.title}</h4>
                        <span 
                          style={{ 
                            ...styles.badge, 
                            backgroundColor: getStatusColor(donation.status),
                            color: "white"
                          }}
                        >
                          {donation.status}
                        </span>
                      </div>
                      <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>{donation.description}</p>
                      <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "#999" }}>
                        <span>Qty: {donation.quantity}</span>
                        <span>•</span>
                        <span>{formatDate(donation.created_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/donor/donations/${donation.id}/edit`)}
                      style={styles.smallBtn}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Feature Highlight */}
        <div style={{ marginTop: "60px" }}>
          <div style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#2E8B57" }}>Let AI do the first step.</h3>
                <p style={{ margin: "0 0 15px 0", color: "#666", lineHeight: "1.6" }}>
                  Upload a photo of your donation and FoodRescue AI can suggest the details for you. 
                  You stay in control and can edit everything before submitting.
                </p>
                <button
                  onClick={() => navigate("/donor/create")}
                  style={styles.primaryBtn}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#2E8B57";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#4CAF50";
                    e.target.style.transform = "none";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Try AI-Assisted Donation
                </button>
              </div>
              <div style={{ fontSize: "80px", opacity: 0.1 }}>🤖</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
