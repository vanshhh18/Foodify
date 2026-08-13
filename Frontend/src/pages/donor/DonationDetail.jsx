import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAvailableDonation } from "../../api/donationApi";

function DonationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        // For donors viewing their own donations, we would need a different endpoint
        // For now, this uses the available donations endpoint
        const data = await getAvailableDonation(id);
        setDonation(data);
      } catch (err) {
        setError("Failed to load donation details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ff9800";
      case "CLAIMED":
        return "#2196F3";
      case "COMPLETED":
        return "#4CAF50";
      default:
        return "#95a5a6";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
        <h1 style={styles.title}>Donation Details</h1>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div style={styles.loadingMessage}>Loading donation details...</div>
        ) : donation ? (
          <div style={styles.detailCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.donationTitle}>{donation.title}</h2>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(donation.status),
                }}
              >
                {donation.status}
              </span>
            </div>

            <div style={styles.detailSection}>
              <h3>Basic Information</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <label>Category</label>
                  <p>{donation.category}</p>
                </div>
                <div style={styles.infoItem}>
                  <label>Quantity</label>
                  <p>{donation.quantity || "Not specified"}</p>
                </div>
                <div style={styles.infoItem}>
                  <label>Created</label>
                  <p>{new Date(donation.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {donation.description && (
              <div style={styles.detailSection}>
                <h3>Description</h3>
                <p>{donation.description}</p>
              </div>
            )}

            <div style={styles.detailSection}>
              <h3>Pickup Details</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <label>Address</label>
                  <p>{donation.pickup_address}</p>
                </div>
                {donation.latitude && (
                  <div style={styles.infoItem}>
                    <label>Latitude</label>
                    <p>{donation.latitude}</p>
                  </div>
                )}
                {donation.longitude && (
                  <div style={styles.infoItem}>
                    <label>Longitude</label>
                    <p>{donation.longitude}</p>
                  </div>
                )}
              </div>
            </div>

            {donation.claimed_by && (
              <div style={{ ...styles.detailSection, backgroundColor: "#e3f2fd" }}>
                <h3>Claimed By</h3>
                <p>
                  <strong>{donation.claimed_by.full_name}</strong> ({donation.claimed_by.role})
                </p>
              </div>
            )}

            {donation.images && donation.images.length > 0 && (
              <div style={styles.detailSection}>
                <h3>Images</h3>
                <div style={styles.imageGrid}>
                  {donation.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.image_url}
                      alt="Donation"
                      style={styles.image}
                    />
                  ))}
                </div>
              </div>
            )}

            {donation.ai_analysis && (
              <div style={styles.detailSection}>
                <h3>AI Analysis</h3>
                <div style={styles.analysisBox}>
                  {donation.ai_analysis.confidence_score && (
                    <p>
                      <strong>Confidence Score:</strong> {donation.ai_analysis.confidence_score}%
                    </p>
                  )}
                  {donation.ai_analysis.analysis_json && (
                    <pre style={styles.analysisJson}>
                      {JSON.stringify(donation.ai_analysis.analysis_json, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.notFound}>Donation not found</div>
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
  },
  title: {
    margin: 0,
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
  },
  loadingMessage: {
    textAlign: "center",
    padding: "40px",
  },
  detailCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #eee",
  },
  donationTitle: {
    margin: 0,
    fontSize: "28px",
  },
  statusBadge: {
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  detailSection: {
    marginBottom: "30px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "15px",
  },
  infoItem: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  analysisBox: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "4px",
  },
  analysisJson: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "4px",
    overflow: "auto",
    fontSize: "12px",
  },
  notFound: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
};

export default DonationDetail;
