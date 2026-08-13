import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styles, statusColors, categoryIcons } from "../../styles/dashboard.styles";
import { getMyDonations, deleteDonation } from "../../api/donationApi";

function MyDonations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyDonations();
      setDonations(data);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to load donations";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) {
      return;
    }

    setDeleting(donationId);
    setError("");

    try {
      await deleteDonation(donationId);
      setDonations((prev) => prev.filter((d) => d.id !== donationId));
      setSuccess("✅ Donation deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to delete donation";
      setError(message);
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadgeStyle = (status) => ({
    ...styles.badge,
    backgroundColor: statusColors[status] || "#999",
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate("/donor")} style={extraStyles.backBtn}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>My Donations</h1>
          <div></div>
        </div>
        <div style={styles.content}>
          <div style={styles.loadingMessage}>
            Loading your donations... ⏳
          </div>
        </div>
      </div>
    );
  }

  if (!loading && donations.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate("/donor")} style={extraStyles.backBtn}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>My Donations</h1>
          <div></div>
        </div>
        <div style={styles.content}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h2>No donations yet</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Start sharing food with those in need!
            </p>
            <button
              onClick={() => navigate("/donor/create")}
              style={styles.primaryBtn}
            >
              Create Your First Donation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/donor")} style={extraStyles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>My Donations ({donations.length})</h1>
        <button
          onClick={() => navigate("/donor/create")}
          style={extraStyles.addBtn}
        >
          + Add Donation
        </button>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <div style={styles.list}>
          {donations.map((donation) => (
            <div key={donation.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    {categoryIcons[donation.category]} {donation.title}
                  </h2>
                  <p style={extraStyles.categoryLabel}>
                    Category: <strong>{donation.category?.toUpperCase()}</strong>
                  </p>
                </div>
                <div style={getStatusBadgeStyle(donation.status)}>
                  {donation.status}
                </div>
              </div>

              <div style={extraStyles.donationDetails}>
                <div style={extraStyles.detailRow}>
                  <span style={extraStyles.detailLabel}>📍 Pickup Address:</span>
                  <span>{donation.pickup_address}</span>
                </div>

                {donation.description && (
                  <div style={extraStyles.detailRow}>
                    <span style={extraStyles.detailLabel}>📝 Description:</span>
                    <span>{donation.description}</span>
                  </div>
                )}

                {donation.quantity && (
                  <div style={extraStyles.detailRow}>
                    <span style={extraStyles.detailLabel}>📦 Quantity:</span>
                    <span>{donation.quantity}</span>
                  </div>
                )}

                {donation.latitude && donation.longitude && (
                  <div style={extraStyles.detailRow}>
                    <span style={extraStyles.detailLabel}>🗺️ Coordinates:</span>
                    <span>
                      {donation.latitude.toFixed(4)}, {donation.longitude.toFixed(4)}
                    </span>
                  </div>
                )}

                <div style={extraStyles.detailRow}>
                  <span style={extraStyles.detailLabel}>📅 Created:</span>
                  <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                </div>

                {donation.status === "CLAIMED" && donation.claimed_by_user && (
                  <div style={extraStyles.claimedBy}>
                    <strong>✅ Claimed by:</strong> {donation.claimed_by_user.full_name}
                    <br />
                    <strong>📞 Phone:</strong> {donation.claimed_by_user.phone_number || "N/A"}
                  </div>
                )}
              </div>

              <div style={extraStyles.actionButtons}>
                {donation.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => navigate(`/donor/donations/${donation.id}/edit`)}
                      style={{
                        ...styles.smallBtn,
                        backgroundColor: "#2196F3",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(donation.id)}
                      disabled={deleting === donation.id}
                      style={{
                        ...styles.dangerBtn,
                        fontSize: "12px",
                        padding: "8px 12px",
                        opacity: deleting === donation.id ? 0.6 : 1,
                      }}
                    >
                      {deleting === donation.id ? "Deleting..." : "🗑️ Delete"}
                    </button>
                  </>
                )}
                {donation.status === "COMPLETED" && (
                  <span style={extraStyles.completedLabel}>✅ Completed</span>
                )}
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
  addBtn: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  categoryLabel: {
    margin: "5px 0 0 0",
    color: "#666",
    fontSize: "12px",
  },
  donationDetails: {
    marginBottom: "15px",
  },
  detailRow: {
    display: "flex",
    marginBottom: "10px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
  detailLabel: {
    fontWeight: "600",
    marginRight: "10px",
    minWidth: "120px",
    color: "#333",
  },
  claimedBy: {
    padding: "10px",
    backgroundColor: "#f0f8ff",
    borderRadius: "4px",
    marginTop: "10px",
    fontSize: "13px",
    color: "#333",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #eee",
  },
  completedLabel: {
    padding: "8px 12px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "12px",
  },
};

export default MyDonations;
