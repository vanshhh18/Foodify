import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styles } from "../../styles/dashboard.styles";
import { getMyDonations, updateDonation } from "../../api/donationApi";

const categories = [
  { id: "food", name: "🍱 Food" },
  { id: "books", name: "📚 Books" },
  { id: "clothes", name: "👕 Clothes" },
];

function EditDonation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    category: "food",
    title: "",
    description: "",
    quantity: "",
    pickup_address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const donations = await getMyDonations();
        const donation = donations.find((item) => String(item.id) === String(id));
        if (!donation) {
          setError("Donation not found");
          return;
        }

        setFormData({
          category: donation.category || "food",
          title: donation.title || "",
          description: donation.description || "",
          quantity: donation.quantity || "",
          pickup_address: donation.pickup_address || "",
          latitude: donation.latitude ?? "",
          longitude: donation.longitude ?? "",
        });
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load donation");
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.pickup_address) {
      setError("Title and pickup address are required.");
      return;
    }

    setSaving(true);

    try {
      await updateDonation(id, {
        category: formData.category,
        title: formData.title,
        description: formData.description,
        quantity: formData.quantity,
        pickup_address: formData.pickup_address,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
      });

      setSuccess("Donation updated successfully!");
      setTimeout(() => navigate("/donor/donations"), 1000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update donation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate("/donor/donations")} style={extraStyles.backBtn}>← Back</button>
          <h1 style={styles.title}>Edit Donation</h1>
        </div>
        <div style={styles.content}>
          <div style={styles.loadingMessage}>Loading donation...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/donor/donations")} style={extraStyles.backBtn}>← Back</button>
        <h1 style={styles.title}>Edit Donation</h1>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pickup Address *</label>
            <textarea
              name="pickup_address"
              value={formData.pickup_address}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.twoColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                style={styles.input}
                step="0.0001"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                style={styles.input}
                step="0.0001"
              />
            </div>
          </div>

          <div style={extraStyles.buttonGroup}>
            <button type="submit" disabled={saving} style={{ ...styles.primaryBtn, flex: 1, opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
            <button type="button" onClick={() => navigate("/donor/donations")} style={{ ...styles.secondaryBtn, flex: 1 }}>
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
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },
};

export default EditDonation;
