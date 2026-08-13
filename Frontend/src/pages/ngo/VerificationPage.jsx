import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard.styles";
import { createVerificationRequest } from "../../api/verificationApi";

function VerificationPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    organization_name: "",
    registration_number: "",
    address: "",
    city: "",
    state: "",
    description: "",
    latitude: null,
    longitude: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        setError("Only PDF, JPG, and PNG files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.organization_name || !formData.registration_number || !formData.address || !formData.city || !formData.state) {
      setError("Please fill in all required fields");
      return;
    }

    if (!selectedFile) {
      setError("Please upload a verification document");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("organization_name", formData.organization_name);
      formDataToSend.append("registration_number", formData.registration_number);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.latitude) {
        formDataToSend.append("latitude", parseFloat(formData.latitude));
      }
      if (formData.longitude) {
        formDataToSend.append("longitude", parseFloat(formData.longitude));
      }
      formDataToSend.append("document", selectedFile);

      await createVerificationRequest(formDataToSend);

      setSuccess("✅ Verification request submitted successfully! Our team will review it within 24-48 hours.");
      
      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to submit verification request";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(`/${user.role}`)} style={extraStyles.backBtn}>
          ← Back
        </button>
        <h1 style={styles.title}>Organization Verification</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <div style={extraStyles.verificationInfoBox}>
          <h2 style={styles.subtitle}>Verify Your Organization</h2>
          <p style={styles.description}>
            Complete this form to verify your {user.role === "ngo" ? "NGO" : "volunteer organization"}. This helps us ensure food safety and builds trust in our community.
          </p>
          <div style={extraStyles.requiredNote}>
            All fields marked with * are required. Verification typically takes 24-48 hours.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Organization Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Organization Name *</label>
            <input
              type="text"
              name="organization_name"
              placeholder="Your organization's official name"
              value={formData.organization_name}
              onChange={handleInputChange}
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Registration Number */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Registration/License Number *</label>
            <input
              type="text"
              name="registration_number"
              placeholder="e.g., NGO123456 or Business License ID"
              value={formData.registration_number}
              onChange={handleInputChange}
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Address */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Address *</label>
            <textarea
              name="address"
              placeholder="Full organization address"
              value={formData.address}
              onChange={handleInputChange}
              style={styles.textarea}
              disabled={loading}
              required
            />
          </div>

          {/* City and State */}
          <div style={styles.twoColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                placeholder="e.g., Delhi"
                value={formData.city}
                onChange={handleInputChange}
                style={styles.input}
                disabled={loading}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State *</label>
              <input
                type="text"
                name="state"
                placeholder="e.g., Delhi"
                value={formData.state}
                onChange={handleInputChange}
                style={styles.input}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Coordinates */}
          <div style={styles.twoColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Latitude (Optional)</label>
              <input
                type="number"
                name="latitude"
                placeholder="e.g., 28.7041"
                step="0.0001"
                value={formData.latitude || ""}
                onChange={handleInputChange}
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Longitude (Optional)</label>
              <input
                type="number"
                name="longitude"
                placeholder="e.g., 77.1025"
                step="0.0001"
                value={formData.longitude || ""}
                onChange={handleInputChange}
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Organization Description (Optional)</label>
            <textarea
              name="description"
              placeholder="Tell us about your organization, mission, and community impact..."
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textarea}
              disabled={loading}
            />
          </div>

          {/* Document Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Verification Document *</label>
            <p style={extraStyles.documentNote}>
              Please upload registration certificate, license, or organizational proof (PDF, JPG, PNG • Max 5MB)
            </p>
            <div style={extraStyles.uploadArea}>
              <input
                type="file"
                id="verificationDoc"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                disabled={loading}
              />
              <label htmlFor="verificationDoc" style={extraStyles.uploadLabel}>
                {selectedFile ? `✓ ${selectedFile.name}` : "📄 Click to select document"}
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div style={extraStyles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.primaryBtn,
                flex: 1,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Submitting..." : "✅ Submit Verification"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/${user.role}`)}
              style={{ ...styles.secondaryBtn, flex: 1 }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
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
  verificationInfoBox: {
    backgroundColor: "#e3f2fd",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    border: "2px solid #2196F3",
  },
  requiredNote: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#fff3cd",
    borderRadius: "4px",
    color: "#856404",
    fontSize: "13px",
    fontWeight: "600",
  },
  documentNote: {
    margin: "0 0 10px 0",
    color: "#666",
    fontSize: "13px",
  },
  uploadArea: {
    marginTop: "10px",
  },
  uploadLabel: {
    display: "block",
    padding: "20px",
    backgroundColor: "white",
    border: "2px dashed #2196F3",
    borderRadius: "4px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "30px",
  },
};

export default VerificationPage;
