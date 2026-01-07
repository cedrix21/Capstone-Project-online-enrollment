import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Redirect to login if no token
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
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, token]);

  // Fetch enrollment summary for admin/registrar
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "registrar")) {
      fetchSummary();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/enrollments/summary",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(res.data);
    } catch (err) {
      setError("Failed to load summary");
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
    } catch {}
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  const isAdminOrRegistrar = user.role === "admin" || user.role === "registrar";

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
                <p>{error}</p>
              ) : summary ? (
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
              ) : (
                <p>No data</p>
              )}
            </div>

            <p>You can manage and approve enrollments.</p>
            <button onClick={() => navigate("/enroll")}>Add Student</button>
            <button
              className="manage-button"
              onClick={() => navigate("/enrollment-management")}
            >
              Go to Enrollment Management
            </button>
          </>
        )}

        {/* Student / Parent View */}
        {!isAdminOrRegistrar && (
          <>
            <p>You may submit an enrollment form.</p>
            <button onClick={() => navigate("/enroll")}>
              Go to Enrollment Form
            </button>
          </>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
