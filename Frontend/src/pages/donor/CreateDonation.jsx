import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles, categoryIcons } from "../../styles/dashboard.styles";
import { createDonation, getAISuggestions } from "../../api/donationApi";

const categories = [
  { id: "food", name: "🍱 Food", emoji: "🍱" },
  { id: "books", name: "📚 Books", emoji: "📚" },
  { id: "clothes", name: "👕 Clothes", emoji: "👕" },
];

// Category-specific forms
const CategoryForms = {
  food: {
    fields: [
      { name: "title", label: "Dish/Food Name *", placeholder: "e.g., Fresh Vegetable Box", type: "text" },
      { name: "description", label: "Description", placeholder: "Describe freshness, expiry date, allergens, etc.", type: "textarea" },
      { name: "quantity", label: "Quantity *", placeholder: "e.g., 20 kg, 50 packets, 100 pieces", type: "text" },
      { name: "pickup_address", label: "Pickup Address *", placeholder: "Full pickup address", type: "textarea" },
    ],
  },
  books: {
    fields: [
      { name: "title", label: "Book Title/Collection Name *", placeholder: "e.g., Educational Books Bundle", type: "text" },
      { name: "description", label: "Description", placeholder: "Book titles, authors, condition, language, etc.", type: "textarea" },
      { name: "quantity", label: "Quantity *", placeholder: "Number of books", type: "text" },
      { name: "pickup_address", label: "Pickup Address *", placeholder: "Full pickup address", type: "textarea" },
    ],
  },
  clothes: {
    fields: [
      { name: "title", label: "Clothing Description *", placeholder: "e.g., Winter Jacket Collection", type: "text" },
      { name: "description", label: "Details", placeholder: "Sizes, condition, materials, etc.", type: "textarea" },
      { name: "quantity", label: "Quantity *", placeholder: "Number of items or descriptions", type: "text" },
      { name: "pickup_address", label: "Pickup Address *", placeholder: "Full pickup address", type: "textarea" },
    ],
  },
};

function CreateDonation() {
  const navigate = useNavigate();
  const [step, setStep] = useState("selectCategory");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [formData, setFormData] = useState({
    category: null,
    title: "",
    description: "",
    quantity: "",
    pickup_address: "",
    latitude: null,
    longitude: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setStep("fillForm");
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPG, PNG, and WEBP images are allowed");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleAISuggest = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setAiLoading(true);
    setError("");

    try {
      const result = await getAISuggestions(selectedCategory, selectedFile);
      setAiSuggestions(result.suggestions);
      
      setFormData((prev) => ({
        ...prev,
        title: result.suggestions.title || prev.title,
        description: result.suggestions.description || prev.description,
        quantity: result.suggestions.quantity || prev.quantity,
      }));
      
      setSuccess(`✅ AI Analysis Complete! Review and edit the suggestions below.`);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to get AI suggestions. Please try again.";
      setError(message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.pickup_address || !selectedCategory) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      await createDonation({
        category: selectedCategory,
        title: formData.title,
        description: formData.description,
        quantity: formData.quantity,
        pickup_address: formData.pickup_address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      });

      setSuccess("✅ Donation created successfully!");
      
      setTimeout(() => {
        navigate("/donor/donations", { state: { message: "Donation created!" } });
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to create donation";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Category selection view
  if (step === "selectCategory") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate("/donor")} style={extraStyles.backBtn}>
            ← Back
          </button>
          <h1 style={styles.title}>🍽️ FoodRescue AI</h1>
          <div></div>
        </div>

        <div style={styles.content}>
          <h2 style={styles.subtitle}>What are you donating?</h2>
          <p style={styles.description}>Choose a category to get started</p>

          <div style={extraStyles.categoryGrid}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                style={extraStyles.categoryCard}
                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={extraStyles.categoryEmoji}>{cat.emoji}</div>
                <div style={extraStyles.categoryName}>{cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = CategoryForms[selectedCategory];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => setStep("selectCategory")} style={extraStyles.backBtn}>
          ← Change Category
        </button>
        <h1 style={styles.title}>Create Donation - {categoryIcons[selectedCategory]}</h1>
        <div></div>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={extraStyles.aiSection}>
            <h3 style={extraStyles.aiTitle}>📸 AI Analysis (Optional)</h3>
            <p style={extraStyles.aiDesc}>Upload an image for AI to suggest details automatically</p>

            <div style={extraStyles.aiUploadArea}>
              <input
                type="file"
                id="aiImage"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                disabled={aiLoading}
              />
              <label htmlFor="aiImage" style={extraStyles.uploadLabel}>
                {selectedFile ? `✓ ${selectedFile.name}` : "📁 Click to select image"}
              </label>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleAISuggest}
                  disabled={aiLoading}
                  style={{
                    ...extraStyles.aiButton,
                    opacity: aiLoading ? 0.6 : 1,
                  }}
                >
                  {aiLoading ? "Analyzing..." : "🤖 Get AI Suggestions"}
                </button>
              )}
            </div>

            {aiSuggestions && (
              <div style={extraStyles.aiResultBox}>
                <p style={extraStyles.aiConfidence}>
                  Confidence: <strong>{(aiSuggestions.confidence * 100).toFixed(0)}%</strong>
                </p>
                <p style={extraStyles.aiNote}>
                  ℹ️ Review and edit all suggestions below before submitting
                </p>
              </div>
            )}
          </div>

          <hr style={extraStyles.divider} />

          {currentCategory.fields.map((field) => (
            <div key={field.name} style={styles.formGroup}>
              <label style={styles.label}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  disabled={loading}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  style={styles.input}
                  disabled={loading}
                />
              )}
            </div>
          ))}

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
              {loading ? "Creating..." : "✅ Create Donation"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/donor")}
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
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  categoryCard: {
    padding: "40px 20px",
    backgroundColor: "white",
    border: "2px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  categoryEmoji: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  categoryName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  aiSection: {
    padding: "20px",
    backgroundColor: "#f0f8ff",
    borderRadius: "8px",
    marginBottom: "30px",
    border: "2px dashed #2196F3",
  },
  aiTitle: {
    margin: "0 0 10px 0",
    color: "#2196F3",
    fontSize: "16px",
  },
  aiDesc: {
    margin: "0 0 20px 0",
    color: "#666",
    fontSize: "14px",
  },
  aiUploadArea: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  uploadLabel: {
    flex: 1,
    padding: "15px",
    backgroundColor: "white",
    border: "2px dashed #2196F3",
    borderRadius: "4px",
    textAlign: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  aiButton: {
    padding: "15px 25px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  aiResultBox: {
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "4px",
    marginTop: "15px",
  },
  aiConfidence: {
    margin: "0 0 10px 0",
    color: "#333",
  },
  aiNote: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
    fontStyle: "italic",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "30px 0",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "30px",
  },
};

export default CreateDonation;