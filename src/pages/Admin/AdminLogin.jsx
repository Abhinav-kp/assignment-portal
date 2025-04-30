import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";     
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";  
     // ← make sure this is imported

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const ADMIN_EMAIL    = "admin@koshys.edu";
  const ADMIN_PASSWORD = "Admin@123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // 1️⃣ set a cookie that marks the admin as logged in
      const auth = getAuth();
  signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
    .then(() => {
      // set your cookie guard if still needed
      Cookies.set("adminLoggedIn","true");
      navigate("/admin-dashboard");
    })
    .catch(err => setError(err.message));
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
