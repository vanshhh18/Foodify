// Global styles used across the app
export const styles = {
  // Layout
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userGreeting: {
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  content: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  },
  hero: {
    marginBottom: "50px",
  },
  subtitle: {
    fontSize: "32px",
    color: "#2c3e50",
    marginBottom: "10px",
    fontWeight: "700",
  },
  description: {
    color: "#666",
    fontSize: "16px",
    marginBottom: "40px",
    lineHeight: "1.6",
  },

  // Buttons and Grids
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  actionButton: {
    padding: "30px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  buttonIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  buttonLabel: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  buttonDesc: {
    fontSize: "14px",
    opacity: 0.9,
  },

  // Forms
  form: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#333",
    fontWeight: "600",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.3s",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
    fontFamily: "inherit",
    minHeight: "100px",
    resize: "vertical",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  // Messages
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
  warningMessage: {
    backgroundColor: "#ffeaa7",
    color: "#d63031",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #fdcb6e",
  },

  // States
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

  // Cards
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
  },
  cardTitle: {
    margin: "0 0 8px 0",
    color: "#333",
    fontSize: "20px",
    fontWeight: "600",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  // Info Boxes
  infoBox: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginTop: "40px",
  },
  infoTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "700",
  },
  infoList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  infoItem: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
  },
  step: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "50%",
    fontWeight: "700",
    flexShrink: 0,
  },

  // Buttons
  primaryBtn: {
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  secondaryBtn: {
    padding: "12px 24px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  dangerBtn: {
    padding: "12px 24px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  smallBtn: {
    padding: "8px 12px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "all 0.3s",
  },
  buttonHover: {
    opacity: 0.9,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  // Two column layout
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  // Lists
  list: {
    display: "grid",
    gap: "20px",
  },
  listItem: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    borderLeft: "4px solid #4CAF50",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },

  // Cards
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },

  // Category Cards
  categoryCard: {
    padding: "40px 20px",
    backgroundColor: "white",
    color: "#333",
    border: "2px solid #e0e0e0",
    borderRadius: "16px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  // Error Message
  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ffcdd2",
    fontSize: "14px",
  },
};

export const categoryIcons = {
  food: "🍱",
  clothes: "👕",
  books: "📚",
};

export const statusColors = {
  PENDING: "#ff9800",
  CLAIMED: "#2196F3",
  COMPLETED: "#4CAF50",
};

export const roleDashboardPaths = {
  donor: "/donor",
  ngo: "/ngo",
  volunteer: "/volunteer",
  admin: "/admin",
};
