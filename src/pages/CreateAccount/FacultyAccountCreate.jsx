// src/pages/FacultyAccountCreate.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";    // ← shared singleton
import "./createAccount.css";

const subjectMapping = {
  BCA: {
    1: ["Programming Fundamentals","Data Structures","Java Programming","Python Programming","Machine Learning","Big Data Analytics"],
    2: ["Web Design","OS","DB Systems","Algorithms","Statistics","Lab II"],
    3: ["Software Engineering","Networks","Discrete Math","Databases","Compiler Design","Lab III"],
    4: ["Mobile Dev","Cloud Computing","Project Mgmt","AI","Security","Lab IV"],
    5: ["Machine Learning","Data Mining","AI Basics","Cybersecurity","Internship","Lab V"],
    6: ["Big Data","Final Year Project","IoT","Ethics","Advanced Networking","Lab VI"],
  },
  BBA: {
    1: ["Principles of Management","Business Environment","Accounting","Economics","English","Comp Apps"],
    2: ["Marketing Mgmt","Org Behavior","HR Mgmt","Statistical Methods","Business Law","Env Science"],
    3: ["Financial Mgmt","Operations Mgmt","Cost Accounting","Business Ethics","Entrepreneurship","Excel Lab"],
    4: ["Strategic Mgmt","Supply Chain","Consumer Behavior","Banking & Insurance","MIS","HR Analytics"],
    5: ["Investment Analysis","Leadership","Performance Mgmt","Event Mgmt","Internship","Elective I"],
    6: ["Intl Business","Retail Mgmt","Digital Marketing","CSR","Elective II","Project"],
  },
  BCOM: {
    1: ["Financial Accounting","Business Law","Microeconomics","Business Maths","English","Env Studies"],
    2: ["Corporate Accounting","Cost Accounting","Macroeconomics","Business Stats","Kannada","Entrepreneurship"],
    3: ["Income Tax","Auditing","Marketing","Financial Mgmt","Indian Economy","E-Commerce"],
    4: ["Banking & Insurance","Business Communication","Investment Analysis","HRM","Excel","Research"],
    5: ["GST & Taxation","Management Accounting","Corp Governance","Strategic Mgmt","Internship","Elective I"],
    6: ["Financial Modeling","Intl Business","Business Ethics","Retail","Elective II","Project"],
  },
  BVA: {
    1: ["Fundamentals of Design","Art History I","Drawing I","2D Design","Color Theory","Visual Thinking"],
    2: ["Drawing II","3D Design","Art History II","Photography","Typography","Studio I"],
    3: ["Painting I","Sculpture I","Digital Art I","Animation","History III","Studio II"],
    4: ["Painting II","Printmaking","Digital Art II","Typography","Visual Culture","Studio III"],
    5: ["Portfolio Dev I","Exhibition Planning","Contemporary Art","Motion Graphics","Internship","Elective I"],
    6: ["Portfolio Dev II","Final Project","Art Criticism","Installation Art","Pro Practices","Exhibition"],
  },
};

export default function FacultyAccountCreate() {
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [course, setCourse]     = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject]   = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");

  // subjects for the selected course+semester
  const availableSubjects =
    course && semester
      ? subjectMapping[course]?.[Number(semester)] || []
      : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!course)    return setError("Please select a course.");
    if (!semester)  return setError("Please select a semester.");
    if (!subject)   return setError("Please select a subject.");
    if (password !== confirm) return setError("Passwords do not match.");

    try {
      // 1) Auth
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // 2) Firestore write: 'faculties/{uid}'
      await setDoc(doc(db, "faculties", user.uid), {
        name,
        email,
        course,
        semester: Number(semester),
        subject,
        createdAt: serverTimestamp(),
        verified:false,
      });

      // 3) Store token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; secure; sameSite=Strict;`;

      alert("Faculty account created!");
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      if (err.code?.startsWith("auth/")) {
        const msgs = {
          "auth/email-already-in-use": "Email already in use.",
          "auth/invalid-email":         "Invalid email address.",
          "auth/weak-password":         "Password must be 6+ characters.",
        };
        setError(msgs[err.code] || err.message);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="student-login-page">
      <div className="login-container">
        <h2>Create Faculty Account</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

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
            <label>Course</label>
            <select
              value={course}
              onChange={e => {
                setCourse(e.target.value);
                setSemester("");
                setSubject("");
              }}
              required
            >
              <option value="">Select course</option>
              {Object.keys(subjectMapping).map(crs => (
                <option key={crs} value={crs}>{crs}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Semester</label>
            <select
              value={semester}
              onChange={e => {
                setSemester(e.target.value);
                setSubject("");
              }}
              disabled={!course}
              required
            >
              <option value="">Select semester</option>
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Subject</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              disabled={!semester}
              required
            >
              <option value="">Select subject</option>
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
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

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <button
          className="login-btn"
          onClick={() => navigate("/student-login")}
        >
          Back to Student Login
        </button>
      </div>
    </div>
  );
}
