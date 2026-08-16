import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { getMyDonations } from "../../api/donationApi";
import "../../styles/donor-dashboard.css";

const CATEGORIES = [
  { id: "food", name: "Food", desc: "Share surplus meals and groceries with those in need.", color: "#2a9d8f" },
  { id: "books", name: "Books", desc: "Give books a second life and inspire learning.", color: "#457b9d" },
  { id: "clothes", name: "Clothes", desc: "Pass on clothes that can help someone stay warm.", color: "#e76f51" },
];

const STATUS_LABELS = { PENDING: "Pending", CLAIMED: "Claimed", COMPLETED: "Completed" };

function DonorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, helped: 0 });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const donations = await getMyDonations();
        setRecentDonations(donations.slice(0, 5));
        const total = donations.length;
        const active = donations.filter((d) => d.status === "PENDING").length;
        const completed = donations.filter((d) => d.status === "COMPLETED").length;
        const helped = donations.reduce((sum, d) => {
          const qty = parseFloat(d.quantity) || 0;
          return sum + Math.max(1, Math.floor(qty / 5));
        }, 0);
        setStats({ total, active, completed, helped });
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  const sidebarLinks = [
    { path: "/donor", label: "Dashboard" },
    { path: "/donor/create", label: "Create Donation" },
    { path: "/donor/donations", label: "My Donations" },
  ];

  return (
    <div className="fd-dashboard">
      {/* Mobile Header */}
      <div className="fd-mobile-header">
        <div className="fd-mobile-brand">
          FoodRescue AI
        </div>
        <button className="fd-hamburger" onClick={() => setSidebarOpen(true)}>
          &#9776;
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fd-mobile-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fd-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="fd-sidebar-brand">
          <h1>FoodRescue AI</h1>
          <p>Donor Portal</p>
        </div>

        <nav className="fd-sidebar-nav">
          {sidebarLinks.map((link) => (
            <button
              key={link.path}
              className={`fd-sidebar-link ${isActive(link.path) ? "active" : ""}`}
              onClick={() => {
                navigate(link.path);
                setSidebarOpen(false);
              }}
            >
              {link.label}
            </button>
          ))}

          <div className="fd-sidebar-divider" />

          <button
            className="fd-sidebar-link"
            onClick={() => {
              navigate("/donor/donations");
              setSidebarOpen(false);
            }}
          >
            Settings
          </button>
        </nav>

        <div className="fd-sidebar-footer">
          <div className="fd-sidebar-user">
            <div className="fd-sidebar-avatar">
              {getInitials(user?.full_name)}
            </div>
            <div className="fd-sidebar-user-info">
              <div className="fd-sidebar-user-name">{user?.full_name}</div>
              <div className="fd-sidebar-user-role">{user?.role || "Donor"}</div>
            </div>
          </div>
          <button className="fd-sidebar-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="fd-main">
        {/* Top Bar */}
        <div className="fd-topbar">
          <div className="fd-topbar-title">Dashboard</div>
          <div className="fd-topbar-greeting">
            Welcome back, <strong>{user?.full_name?.split(" ")[0]}</strong>
          </div>
        </div>

        <div className="fd-content">
          {/* Error */}
          {error && (
            <div className="fd-error">
              {error}
            </div>
          )}

          {/* Hero Section */}
          <section className="fd-hero">
            <div className="fd-hero-content">
              <div className="fd-hero-badge">
                Making an impact
              </div>
              <h2>
                Make a difference,<br />one donation at a time.
              </h2>
              <p>
                Your generosity can change lives. Every food donation, book shared, or
                clothing item passed on reaches people and organizations who need them most.
              </p>
              <div className="fd-hero-actions">
                <button
                  className="fd-btn-hero fd-btn-hero-primary"
                  onClick={() => navigate("/donor/create")}
                >
                  Create Donation
                </button>
                <button
                  className="fd-btn-hero fd-btn-hero-secondary"
                  onClick={() => navigate("/donor/donations")}
                >
                  View My Donations
                </button>
              </div>
            </div>
          </section>

          {/* Impact Stats */}
          <div className="fd-stats-grid">
            <div className="fd-stat-card total">
              <div className="fd-stat-dot" style={{ background: "#2d6a4f" }} />
              <div className="fd-stat-value">
                {loading ? <div className="fd-stat-skeleton" /> : stats.total}
              </div>
              <div className="fd-stat-label">Total Donations</div>
            </div>
            <div className="fd-stat-card active">
              <div className="fd-stat-dot" style={{ background: "#457b9d" }} />
              <div className="fd-stat-value">
                {loading ? <div className="fd-stat-skeleton" /> : stats.active}
              </div>
              <div className="fd-stat-label">Awaiting Pickup</div>
            </div>
            <div className="fd-stat-card completed">
              <div className="fd-stat-dot" style={{ background: "#2a9d8f" }} />
              <div className="fd-stat-value">
                {loading ? <div className="fd-stat-skeleton" /> : stats.completed}
              </div>
              <div className="fd-stat-label">Completed</div>
            </div>
            <div className="fd-stat-card helped">
              <div className="fd-stat-dot" style={{ background: "#e76f51" }} />
              <div className="fd-stat-value">
                {loading ? <div className="fd-stat-skeleton" /> : stats.helped}
              </div>
              <div className="fd-stat-label">Lives Impacted</div>
            </div>
          </div>

          {/* Donation Categories */}
          <div className="fd-section-header">
            <h3 className="fd-section-title">What would you like to give?</h3>
          </div>
          <div className="fd-categories-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`fd-category-card ${cat.id}`}
                onClick={() => navigate("/donor/create")}
              >
                <div className="fd-category-icon" style={{ background: cat.color + "18", color: cat.color }}>
                  {cat.name[0]}
                </div>
                <div>
                  <div className="fd-category-name">{cat.name}</div>
                  <div className="fd-category-desc">{cat.desc}</div>
                  <div className="fd-category-arrow" style={{ color: cat.color }}>
                    Create donation &rarr;
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Recent Donations */}
          <div className="fd-section-header">
            <h3 className="fd-section-title">Recent Donations</h3>
            <button
              className="fd-section-link"
              onClick={() => navigate("/donor/donations")}
            >
              View all &rarr;
            </button>
          </div>

          {loading ? (
            <div className="fd-loading">
              <div className="fd-spinner" />
              Loading your donations...
            </div>
          ) : recentDonations.length === 0 ? (
            <div className="fd-empty">
              <div className="fd-empty-circle">+</div>
              <h3>No donations yet</h3>
              <p>
                Your first donation can start making a real difference. It only takes
                a minute to share something with someone who needs it.
              </p>
              <button
                className="fd-btn-cta"
                onClick={() => navigate("/donor/create")}
              >
                Create Your First Donation
              </button>
            </div>
          ) : (
            <div className="fd-donations-list">
              {recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="fd-donation-card"
                  onClick={() => navigate(`/donor/donations/${donation.id}/edit`)}
                >
                  <div className={`fd-donation-icon ${donation.category}`}>
                    {CATEGORIES.find((c) => c.id === donation.category)?.name?.[0] || ""}
                  </div>
                  <div className="fd-donation-info">
                    <div className="fd-donation-title">{donation.title}</div>
                    <div className="fd-donation-meta">
                      <span>{donation.quantity || "N/A"}</span>
                      <span>{formatDate(donation.created_at)}</span>
                      {donation.description && (
                        <span>{donation.description.slice(0, 50)}{donation.description.length > 50 ? "..." : ""}</span>
                      )}
                    </div>
                  </div>
                  <span className={`fd-donation-status ${donation.status}`}>
                    {STATUS_LABELS[donation.status] || donation.status}
                  </span>
                  <span className="fd-donation-action">&rarr;</span>
                </div>
              ))}
            </div>
          )}

          {/* AI Feature Highlight */}
          <div className="fd-section-header">
            <h3 className="fd-section-title">AI-Powered Donations</h3>
          </div>
          <div className="fd-ai-card">
            <div className="fd-ai-content">
              <div className="fd-ai-label">
                Powered by AI
              </div>
              <h3>Let AI do the first step.</h3>
              <p>
                Upload a photo of your donation and FoodRescue AI can suggest the details
                for you. You stay in control and can edit everything before submitting.
              </p>
              <button
                className="fd-btn-ai"
                onClick={() => navigate("/donor/create")}
              >
                Try AI-Assisted Donation
              </button>
            </div>
            <div className="fd-ai-visual">
              <div className="fd-ai-orbit">
                <div className="fd-ai-orbit-dot" />
              </div>
              <div className="fd-ai-visual-graphic">
                AI
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DonorDashboard;
