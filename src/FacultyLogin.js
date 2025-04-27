import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";   // ← make sure you import your firebase config
import "./FacultyLogin.css";

const FacultyLogin = () => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Get a fresh token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; secure; sameSite=Strict;`;

      console.log("Faculty Login Success:", user);
      navigate("/");  // ← wherever you want to send after login
    } catch (err) {
      console.error("Faculty Login Error:", err);
      if (err.code?.startsWith("auth/")) {
        const msgs = {
          "auth/invalid-email": "Invalid email address.",
          "auth/user-not-found": "No account found with this email.",
          "auth/wrong-password": "Incorrect password.",
        };
        setError(msgs[err.code] || "Login failed. Please try again.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="faculty-login-page">
      <div className="login-container">
        <h2>Faculty Login</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <button className="login-btn" onClick={() => navigate("/create-faculty")}>
          Create an Account
        </button>
      </div>
    </div>
  );
};

export default FacultyLogin;
