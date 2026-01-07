import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EnrollmentManagement.css";

export default function EnrollmentManagement() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Fetch logged-in user
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

  // ✅ Redirect non-admin/registrar users
  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin" && user.role !== "registrar") {
      navigate("/enroll"); // redirect non-admins
    }
  }, [user, navigate]);

  // Fetch enrollments for admin/registrar
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "registrar")) {
      fetchEnrollments();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/enrollments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments(res.data);
    } catch (err) {
      setMessage("Failed to load enrollments");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/enrollment/${id}/${status}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Enrollment ${status}`);
      fetchEnrollments();
    } catch (err) {
      setMessage("Action failed");
    }
  };

  return (
    <div className="enrollment-management">
      <h2>Enrollment Management</h2>
      {message && <p className="message">{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id}>
              <td>
                {e.firstName} {e.lastName}
              </td>
              <td>{e.email}</td>
              <td>{e.gradeLevel}</td>
              <td>
                <span className={`status ${e.status}`}>{e.status}</span>
              </td>
              <td>
                {e.status === "pending" && (
                  <>
                    <button
                      className="approve"
                      onClick={() => updateStatus(e.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => updateStatus(e.id, "reject")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
