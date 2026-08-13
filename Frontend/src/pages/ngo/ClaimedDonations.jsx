import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableDonations, completeDonation } from "../../api/donationApi";

function ClaimedDonations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getAvailableDonations();
        // Filter only claimed donations
        const claimed = data.filter((d) => d.status === "CLAIMED");
        setDonations(claimed);
      } catch (err) {
        setError("Failed to load claimed donations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleCompleteDonation = async (donationId) => {
    setCompleting(donationId);
    setError("");
    setSuccess("");

    try {
      await completeDonation(donationId);
      setSuccess("Donation marked as completed!");
      
      // Update the donations list
      setDonations((prev) =>
        prev.filter((d) => d.id !== donationId)
      );

      // Refresh after 2 seconds
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to complete donation";
      setError(message);
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/ngo")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>My Claimed Donations</h1>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        {loading ? (
          <div style={styles.loadingMessage}>Loading your claimed donations...</div>
        ) : donations.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p>No claimed donations yet</p>
            <button
              onClick={() => navigate("/ngo/available")}
              style={styles.browseBtn}
            >
              Browse Available Donations
            </button>
          </div>
        ) : (
          <div style={styles.donationsList}>
            {donations.map((donation) => (
              <div key={donation.id} style={styles.donationCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.donationTitle}>{donation.title}</h3>
                    <p style={styles.donor}>
                      From: <strong>{donation.user?.full_name || "Unknown"}</strong>
                    </p>
                  </div>
                  <span style={styles.statusBadge}>
                    {donation.status}
                  </span>
                </div>

                <div style={styles.donationDetails}>
                  <div style={styles.detailGrid}>
                    <div>
                      <strong>Category:</strong> {donation.category}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {donation.quantity || "Not specified"}
                    </div>
                  </div>

                  <div style={styles.detailFull}>
                    <strong>Pickup Address:</strong> {donation.pickup_address}
                  </div>

                  {donation.description && (
                    <div style={styles.detailFull}>
                      <strong>Description:</strong> {donation.description}
                    </div>
                  )}

                  <div style={styles.timestamp}>
                    Claimed: {new Date(donation.updated_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => navigate(`/ngo/donation/${donation.id}`)}
                    style={styles.viewBtn}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleCompleteDonation(donation.id)}
                    disabled={completing === donation.id}
                    style={{
                      ...styles.completeBtn,
                      opacity: completing === donation.id ? 0.6 : 1,
                    }}
                  >
                    {completing === donation.id ? "Completing..." : "Mark as Collected"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
    alignItems: "center",
    gap: "20px",
  },
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  title: {
    margin: 0,
    fontSize: "28px",
  },
  content: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px",
  },
  errorMessage: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #fcc",
  },
  successMessage: {
    backgroundColor: "#efe",
    color: "#3c3",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #cfc",
  },
  loadingMessage: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  browseBtn: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
  donationsList: {
    display: "grid",
    gap: "20px",
  },
  donationCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderLeft: "4px solid #2196F3",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
  },
  donationTitle: {
    margin: "0 0 8px 0",
    color: "#333",
    fontSize: "20px",
  },
  donor: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
  },
  statusBadge: {
    display: "inline-block",
    backgroundColor: "#2196F3",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  donationDetails: {
    margin: "15px 0",
    color: "#666",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "10px",
  },
  detailFull: {
    marginBottom: "10px",
  },
  timestamp: {
    fontSize: "12px",
    color: "#999",
    marginTop: "10px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  viewBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#34495e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  completeBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ClaimedDonations;
