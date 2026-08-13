import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styles, categoryIcons } from "../../styles/dashboard.styles";
import { getAvailableDonations, claimDonation } from "../../api/donationApi";

function AvailableDonations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [claiming, setClaiming] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAvailableDonations();
      setDonations(data);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to load donations";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (donationId) => {
    setClaiming(donationId);
    setError("");

    try {
      await claimDonation(donationId);
      setSuccess("✅ Donation claimed successfully!");
      setDonations((prev) => prev.filter((d) => d.id !== donationId));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to claim donation";
      setError(message);
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate("/ngo")} style={extraStyles.backBtn}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>Browse Donations</h1>
          <div></div>
        </div>
        <div style={styles.content}>
          <div style={styles.loadingMessage}>Loading available donations... ⏳</div>
        </div>
      </div>
    );
  }

  if (!loading && donations.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate("/ngo")} style={extraStyles.backBtn}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>Browse Donations</h1>
          <div></div>
        </div>
        <div style={styles.content}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h2>No donations available yet</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Check back soon for new donations!
            </p>
            <button onClick={() => navigate("/ngo")} style={styles.primaryBtn}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/ngo")} style={extraStyles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>Browse Donations ({donations.length})</h1>
        <button onClick={fetchDonations} style={extraStyles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <div style={extraStyles.gridContainer}>
          {donations.map((donation) => (
            <div key={donation.id} style={extraStyles.donationCardGrid}>
              <div style={extraStyles.cardTitleSection}>
                <h2 style={extraStyles.cardTitle}>
                  {categoryIcons[donation.category] || "📦"} {donation.title}
                </h2>
                <div style={extraStyles.categoryTag}>{donation.category?.toUpperCase()}</div>
              </div>

              <div style={extraStyles.cardContent}>
                {donation.description && (
                  <p style={extraStyles.description}>{donation.description}</p>
                )}

                <div style={extraStyles.infoGrid}>
                  {donation.quantity && (
                    <div style={extraStyles.infoItem}>
                      <span style={extraStyles.infoLabel}>📦 Quantity</span>
                      <span style={extraStyles.infoValue}>{donation.quantity}</span>
                    </div>
                  )}

                  <div style={extraStyles.infoItem}>
                    <span style={extraStyles.infoLabel}>📍 Location</span>
                    <span style={extraStyles.infoValue}>
                      {donation.pickup_address?.substring(0, 30) || "Address unavailable"}...
                    </span>
                  </div>

                  <div style={extraStyles.infoItem}>
                    <span style={extraStyles.infoLabel}>👤 Donor</span>
                    <span style={extraStyles.infoValue}>
                      {donation.created_by?.full_name || "Anonymous"}
                    </span>
                  </div>

                  <div style={extraStyles.infoItem}>
                    <span style={extraStyles.infoLabel}>📱 Contact</span>
                    <span style={extraStyles.infoValue}>
                      {donation.created_by?.phone_number || "N/A"}
                    </span>
                  </div>
                </div>

                {donation.latitude && donation.longitude && (
                  <div style={extraStyles.coordinates}>
                    🗺️ Coordinates: {donation.latitude.toFixed(4)}, {donation.longitude.toFixed(4)}
                  </div>
                )}

                <div style={extraStyles.detailedAddress}>
                  <strong>Full Address:</strong>
                  <p style={extraStyles.detailedAddress_p}>{donation.pickup_address}</p>
                </div>
              </div>

              <div style={extraStyles.cardFooter}>
                <button
                  onClick={() => handleClaim(donation.id)}
                  disabled={claiming === donation.id}
                  style={{
                    ...styles.primaryBtn,
                    flex: 1,
                    opacity: claiming === donation.id ? 0.6 : 1,
                  }}
                >
                  {claiming === donation.id ? "Claiming..." : "✅ Claim Donation"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const extraStyles = {
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  refreshBtn: {
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  },
  donationCardGrid: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s",
  },
  cardTitleSection: {
    padding: "15px",
    borderBottom: "2px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: "10px",
  },
  cardTitle: {
    margin: 0,
    color: "#333",
    fontSize: "18px",
    fontWeight: "600",
    flex: 1,
  },
  categoryTag: {
    padding: "6px 12px",
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  cardContent: {
    padding: "15px",
    flex: 1,
  },
  description: {
    margin: "0 0 15px 0",
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "15px",
  },
  infoItem: {
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    borderLeft: "3px solid #2196F3",
  },
  infoLabel: {
    display: "block",
    fontSize: "11px",
    color: "#999",
    fontWeight: "600",
    marginBottom: "5px",
  },
  infoValue: {
    display: "block",
    fontSize: "13px",
    color: "#333",
    fontWeight: "600",
    wordBreak: "break-word",
  },
  coordinates: {
    padding: "8px",
    backgroundColor: "#f0f8ff",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#1976d2",
    marginBottom: "10px",
  },
  detailedAddress: {
    padding: "10px",
    backgroundColor: "#fafafa",
    borderRadius: "4px",
    borderLeft: "3px solid #4CAF50",
    marginBottom: "15px",
  },
  detailedAddress_p: {
    margin: "5px 0 0 0",
    fontSize: "13px",
    color: "#333",
    lineHeight: "1.5",
  },
  cardFooter: {
    padding: "15px",
    borderTop: "2px solid #eee",
    display: "flex",
    gap: "10px",
  },
};

export default AvailableDonations;
