import React, { useEffect, useState } from "react";
import './Admin.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChampagneGlasses,
  faCalendarAlt,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import logo from "../../Assets/Images/fav.png";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  doc as firestoreDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

export default function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Announcement form state
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody]   = useState("");
  const [annError, setAnnError] = useState("");
  const [success, setSuccess]   = useState("");

  // Faculties list
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const isAdmin = Cookies.get("adminLoggedIn") === "true";
    if (isAdmin) {
      setIsLoggedIn(true);

      // Subscribe to faculties collection
      const unsub = onSnapshot(collection(db, "faculties"), snap => {
        const list = snap.docs.map(facDoc => ({
          id: facDoc.id,
          ...facDoc.data()
        }));
        console.log("Faculties:", list);
        setFaculties(list);
      });
      return () => unsub();
    } else {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("adminLoggedIn");
    navigate("/admin-login", { replace: true });
  };

  const handleAnnouncementSubmit = async e => {
    e.preventDefault();
    if (!annTitle.trim() || !annBody.trim()) {
      setAnnError("Please fill both Title and Message.");
      setSuccess("");
      return;
    }
    setAnnError("");
    try {
      await addDoc(collection(db, "announcements"), {
        title: annTitle.trim(),
        message: annBody.trim(),
        postedAt: new Date()
      });
      setAnnTitle("");
      setAnnBody("");
      setSuccess("Announcement published successfully!");
    } catch (err) {
      console.error("Error publishing announcement:", err);
      setAnnError("Failed to publish announcement. Try again.");
      setSuccess("");
    }
  };

  const handleVerify = async id => {
    try {
      await updateDoc(firestoreDoc(db, "faculties", id), {
        verified: true
      });
    } catch (err) {
      console.error("Error verifying faculty:", err);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <main>
    
    <div className="admin-container">
      <header className="institution-header">
        <div className="header-top">
          <img src={logo} alt="Logo" className="logo" />
          <div className="header-text">
            <h1>Koshys Group of Institution</h1>
            <p>Admin Dashboard</p>
          </div>
          <div className="login-section">
            <button
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <button className="nav-btn">
                <FontAwesomeIcon icon={faHome} /> Dashboard
              </button>
            </li>
            <li>
              <button className="nav-btn">
                <FontAwesomeIcon icon={faChampagneGlasses} /> College Events
              </button>
            </li>
            <li>
              <button className="nav-btn">
                <FontAwesomeIcon icon={faCalendarAlt} /> Academic Calendar
              </button>
            </li>
            <li>
              <button
                className="nav-btn"
                onClick={() =>
                  document
                    .getElementById("help")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <FontAwesomeIcon icon={faQuestionCircle} /> Help Desk
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="admin-main">
        <div className="admin-main-content">
          {/* Left: Announcement Form */}
          <section className="announcement-form-section card">
            <h2>Publish New Announcement</h2>
            {annError && <p className="error-message">{annError}</p>}
            {success && <p className="success-message">{success}</p>}
            <form
              onSubmit={handleAnnouncementSubmit}
              className="announcement-form"
            >
              <div className="input-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={annBody}
                  onChange={e => setAnnBody(e.target.value)}
                  className="textarea-field"
                />
              </div>
              <button type="submit" className="btn-primary">
                Publish
              </button>
            </form>
          </section>

          {/* Right: Faculty Verification Table */}
          <section className="faculty-table-section card">
            <h2>Verify Faculties</h2>
            {faculties.length > 0 ? (
              <table className="faculty-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Verified</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faculties.map(f => (
                    <tr key={f.id}>
                      <td>
                        {f.firstName} {f.lastName}
                      </td>
                      <td>{f.email}</td>
                      <td>{f.course}</td>
                      <td>{f.verified ? "Yes" : "No"}</td>
                      <td>
                        {!f.verified && (
                          <button
                            className="btn-primary"
                            onClick={() => handleVerify(f.id)}
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No faculties to display.</p>
            )}
          </section>
        </div>
      </main>

      <footer className="institution-footer sticky-footer" id="help">
        <div className="footer-content">
          <div className="contact-info">
            <h4>Contact Us</h4>
            <p>Email: assignments@koshys.edu</p>
            <p>Phone: +91 80 1234 5678</p>
          </div>
        </div>
      </footer>
    </div>
    </main>
  );
}
