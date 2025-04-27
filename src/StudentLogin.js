import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css";

// Firebase configuration (match your project creds)
const firebaseConfig = {
  apiKey: "AIzaSyBH3b4REpFQ62Lmu7XMjd7PyK84vvagl1I",
  authDomain: "assignment--submission.firebaseapp.com",
  projectId: "assignment--submission",
  storageBucket: "assignment--submission.firebasestorage.app",
  messagingSenderId: "942206471384",
  appId: "1:942206471384:web:e9327a00c733e85134dbad",
  measurementId: "G-7LNT7TZJ50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Firebase sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve ID token
      const token = await user.getIdToken();
      // Store token in local storage
      localStorage.setItem("token", token);
      // Set token cookie
      document.cookie = `token=${token}; path=/; secure; sameSite=Strict;`;

      alert("Login successful!");
      // Redirect to home
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError("No user found with this email");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address");
          break;
        default:
          setError(err.message || "Login failed");
      }
    }
  };

  return (
    <div className="student-login-page">
      <div className="login-container">
        <h2>Student Login</h2>
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
        <button className="login-btn" onClick={() => navigate("/create-account")}>Create an Account</button>
      </div>
    </div>
  );
};

export default StudentLogin;
