import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch logged-in user
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/user-test", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("User fetch error:", err.response || err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, token]);

  const isAdminOrRegistrar = user?.role === "admin" || user?.role === "registrar";

  // Fetch summary for admin/registrar
  useEffect(() => {
    if (isAdminOrRegistrar) {
      fetchSummary();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    setError("");
    try {
      console.log("DEBUG: Sending token to summary endpoint:", token);
      const res = await axios.get("http://127.0.0.1:8000/api/enrollments/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary({
        pending: res.data?.pending || 0,
        approved: res.data?.approved || 0,
        rejected: res.data?.rejected || 0,
      });
    } catch (err) {
      console.error("Summary fetch error:", err.response || err);
      setError("Failed to load summary. Make sure your user role is admin/registrar and API is working.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn("Logout failed:", err.response || err);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome, {user.name}!</h1>

        {/* Admin / Registrar View */}
        {isAdminOrRegistrar && (
          <>
            <p>You can manage and approve enrollments.</p>

            <div className="summary-cards">
              {loadingSummary ? (
                <p>Loading summary...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                <>
                  <div className="card pending">
                    <h3>Pending</h3>
                    <p>{summary.pending}</p>
                  </div>
                  <div className="card approved">
                    <h3>Approved</h3>
                    <p>{summary.approved}</p>
                  </div>
                  <div className="card rejected">
                    <h3>Rejected</h3>
                    <p>{summary.rejected}</p>
                  </div>
                </>
              )}
            </div>

            <div className="admin-buttons">
              <button onClick={() => navigate("/enroll")}>Add Student</button>
              <button onClick={() => navigate("/enrollment-management")}>Manage Enrollments</button>
              <button onClick={() => navigate("/enrollment-qr")}>Show Enrollment QR</button>
            </div>
          </>
        )}

        {/* Student / Parent View */}
        {!isAdminOrRegistrar && (
          <>
            <p>You may submit an enrollment form.</p>
            <button onClick={() => navigate("/enroll")}>Go to Enrollment Form</button>
          </>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
