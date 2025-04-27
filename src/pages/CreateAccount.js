import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./createAccount.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH3b4REpFQ62Lmu7XMjd7PyK84vvagl1I",
  authDomain: "assignment--submission.firebaseapp.com",
  projectId: "assignment--submission",
  storageBucket: "assignment--submission.firebasestorage.app",
  messagingSenderId: "942206471384",
  appId: "1:942206471384:web:e9327a00c733e85134dbad",
  measurementId: "G-7LNT7TZJ50",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const CreateAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [course, setCourse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!course) {
      setError("Please select your course.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save profile data in Firestore under "students" collection
      await setDoc(doc(db, "students", user.uid), {
        name: name,
        email: email,
        course: course,
        createdAt: serverTimestamp(),
      });

      // Optionally store token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; secure; sameSite=Strict;`;

      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      if (err.code && err.code.startsWith("auth/")) {
        // Firebase Auth errors
        const messages = {
          "auth/email-already-in-use": "Email already in use.",
          "auth/invalid-email": "Invalid email.",
          "auth/weak-password": "Weak password (min 6 chars).",
        };
        setError(messages[err.code] || err.message);
      } else if (err.code === "permission-denied") {
        setError("Insufficient Firestore permissions. Check your rules.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="student-login-page">
      <div className="login-container">
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <label>Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            >
              <option value="">Select your course</option>
              <option value="Mathematics">BCA</option>
              <option value="Computer Science">BBA</option>
              <option value="Physics">BCOM</option>
              <option value="Chemistry">BVA</option>
            </select>
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
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <button onClick={() => navigate("/student-login")}>
          Create an Account
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
