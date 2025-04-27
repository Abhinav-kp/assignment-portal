// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");

  // hard-coded admin credentials
  const ADMIN_EMAIL    = "admin@koshys.edu";
  const ADMIN_PASSWORD = "Admin@123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // check against our hard-coded creds
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // successful admin login
      navigate("/admin-dashboard");  
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="student-login-page">
      <div className="login-container">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
