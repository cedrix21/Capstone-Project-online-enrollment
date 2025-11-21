import { useState } from "react";
import axios from "axios";
import "./Enrollment.css";

export default function Enrollment() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gradeLevel: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/enroll",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Enrollment successful!");
      setFormData({ firstName: "", lastName: "", email: "", gradeLevel: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed");
    }
  };

  return (
    <div className="enrollment-container">
      <div className="enrollment-card">
        <h2>Student Enrollment</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Grade Level</label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select grade</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
            </select>
          </div>
          <button type="submit" className="enroll-button">
            Enroll
          </button>
        </form>
      </div>
    </div>
  );
}
