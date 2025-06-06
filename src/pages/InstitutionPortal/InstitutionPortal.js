import React, { useEffect, useState } from "react";
import './InstitutionPortal.css';
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChampagneGlasses,
  faCalendarAlt,
  faQuestionCircle,
  faBullhorn,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import logo from "../../Assets/Images/fav.png";
import { auth, db, storage } from "../../firebase";

// Subject Mapping Object
const subjectMapping = {
  BCA: {
    1: [
      "Programming Fundamentals",
      "Mathematics I",
      "Computer Organization",
      "Digital Logic",
      "Communication Skills",
      "Lab I",
    ],
    2: [
      "Data Structures",
      "Mathematics II",
      "Database Systems",
      "Operating Systems",
      "Web Design",
      "Lab II",
    ],
    3: [
      "Java Programming",
      "Software Engineering",
      "Computer Networks",
      "Discrete Math",
      "Statistics",
      "Lab III",
    ],
    4: [
      "Python Programming",
      "Mobile Application Dev",
      "Cloud Computing",
      "System Software",
      "Project Management",
      "Lab IV",
    ],
    5: [
      "Machine Learning",
      "Data Mining",
      "AI Basics",
      "Cybersecurity",
      "Internship",
      "Lab V",
    ],
    6: [
      "Big Data Analytics",
      "Final Year Project",
      "IoT Fundamentals",
      "IT Ethics",
      "Advanced Networking",
      "Lab VI",
    ],
  },
  BCOM: {
    1: [
      "Financial Accounting",
      "Business Law",
      "Microeconomics",
      "Business Mathematics",
      "English",
      "Environmental Studies",
    ],
    2: [
      "Corporate Accounting",
      "Cost Accounting",
      "Macroeconomics",
      "Business Statistics",
      "Kannada",
      "Entrepreneurship",
    ],
    3: [
      "Income Tax",
      "Auditing",
      "Marketing",
      "Financial Management",
      "Indian Economy",
      "E-Commerce",
    ],
    4: [
      "Banking & Insurance",
      "Business Communication",
      "Investment Analysis",
      "HRM",
      "Excel for Business",
      "Business Research",
    ],
    5: [
      "GST & Taxation",
      "Management Accounting",
      "Corporate Governance",
      "Strategic Mgmt",
      "Internship",
      "Elective I",
    ],
    6: [
      "Financial Modeling",
      "International Business",
      "Business Ethics",
      "Retail Management",
      "Elective II",
      "Project",
    ],
  },
  BBA: {
    1: [
      "Principles of Management",
      "Business Environment",
      "Accounting",
      "Economics",
      "English",
      "Computer Applications",
    ],
    2: [
      "Marketing Management",
      "Organizational Behavior",
      "HR Management",
      "Business Law",
      "Statistics",
      "Environmental Science",
    ],
    3: [
      "Financial Management",
      "Operations Mgmt",
      "Cost Accounting",
      "Business Ethics",
      "Entrepreneurship",
      "Excel Lab",
    ],
    4: [
      "Strategic Mgmt",
      "Supply Chain Mgmt",
      "Consumer Behavior",
      "Banking & Insurance",
      "MIS",
      "HR Analytics",
    ],
    5: [
      "Investment Analysis",
      "Leadership Skills",
      "Performance Mgmt",
      "Event Management",
      "Internship",
      "Elective I",
    ],
    6: [
      "International Business",
      "Retail Mgmt",
      "Digital Marketing",
      "Corporate Social Responsibility",
      "Elective II",
      "Project",
    ],
  },
  BVA: {
    1: [
      "Fundamentals of Design",
      "Art History I",
      "Drawing I",
      "2D Design",
      "Color Theory",
      "Visual Thinking",
    ],
    2: [
      "Drawing II",
      "3D Design",
      "Art History II",
      "Photography Basics",
      "Typography",
      "Studio Practice I",
    ],
    3: [
      "Painting I",
      "Sculpture I",
      "Digital Art I",
      "Art History III",
      "Animation Basics",
      "Studio Practice II",
    ],
    4: [
      "Painting II",
      "Sculpture II",
      "Digital Art II",
      "Printmaking",
      "Visual Culture",
      "Studio Practice III",
    ],
    5: [
      "Portfolio Dev I",
      "Exhibition Planning",
      "Contemporary Art",
      "Motion Graphics",
      "Internship",
      "Art & Society",
    ],
    6: [
      "Portfolio Dev II",
      "Final Project",
      "Art Criticism",
      "Installation Art",
      "Professional Practices",
      "Exhibition",
    ],
  },
};

export default function InstitutionPortal() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [assignSemester, setAssignSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState("");
  const [formError, setFormError] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      const snapshot = await getDocs(collection(db, "assignments"));
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAssignments();
  }, []);

  // fetch announcements dynamically
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "announcements"), (snap) => {
      const anns = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.postedAt.toMillis() - a.postedAt.toMillis());
      setAnnouncements(anns);
    });
    return unsub;
  }, []);

  // auth state & profile
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;
        const studentSnap = await getDoc(doc(db, "students", user.uid));
        if (studentSnap.exists()) {
          setProfile({ ...studentSnap.data(), uid: user.uid });
          setIsStudent(true);
        } else {
          const facultySnap = await getDoc(doc(db, "faculties", user.uid));
          if (facultySnap.exists()) {
            setProfile({ ...facultySnap.data(), uid: user.uid });
            setIsStudent(false);
          }
        }
      });
    }
  }, []);

  // approve assignment
  const approveAssignment = async (id) => {
    const ref = doc(db, "assignments", id);
    await updateDoc(ref, { status: "approved" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    setIsLoggedIn(false);
    setProfile(null);
    navigate("/");
  };

  // submit assignment
  const handleSubmit = async (e) => { /* unchanged */ };

  // derive availableSubjects
  const normalized = profile?.course?.replace(/\s+/g, "").toLowerCase();
  const courseKey = { bca: "BCA", bcom: "BCOM", bba: "BBA", bva: "BVA" }[normalized];
  const availableSubjects = courseKey && assignSemester
    ? subjectMapping[courseKey][Number(assignSemester)]
    : [];

  useEffect(() => { setSubject(""); }, [assignSemester]);

  // fetch faculty profile for filtering
  const [faculty, setFaculty] = useState(null);
  useEffect(() => {
    if (isLoggedIn && !isStudent && profile?.uid) {
      return onSnapshot(doc(db, "faculties", profile.uid), snap => {
        snap.exists() && setFaculty(snap.data());
      });
    }
  }, [isLoggedIn, isStudent, profile?.uid]);

  return (
    <div>
      <header className="institution-header">
        <div className="header-top">
          <img src={logo} alt="Logo" className="logo" />
          <div className="header-text">
            <h1>Koshys Group of Institution</h1>
            <p>Assignment Submission Portal</p>
          </div>
          <div className="login-section">
  {isLoggedIn ? (
    <>
      {isStudent && (
        <button className="profile-btn" onClick={() => navigate("/profile")}>
          Profile
        </button>
      )}
      <button className="login-btn" onClick={handleLogout}>
        Logout
      </button>
    </>
  ) : (
    /* three buttons in a row */
    <>
      <button className="login-btn" onClick={() => navigate("/student-login")}>
        Student Login
      </button>
      <button className="login-btn" onClick={() => navigate("/faculty-login")}>
        Faculty Login
      </button>
      <button className="login-btn" onClick={() => navigate("/admin-login")}>
        Admin Login
      </button>
    </>
  )}
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


      <main className="content-container">
        {isLoggedIn && !isStudent && (
          <section className="assignments-table">
            <h2>Assignments Submitted</h2>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Subject</th>
                  <th>Comments</th>
                  <th>File</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  // only show those matching this faculty’s course & subject
                  assignments
                    .filter(
                      (a) =>
                        faculty &&
                        a.course === faculty.course &&
                        a.subject === faculty.subject
                    )
                    .map((assignment) => (
                      <tr key={assignment.id}>
                        <td>{assignment.studentName}</td>
                        <td>{assignment.course}</td>
                        <td>{assignment.semester}</td>
                        <td>{assignment.subject}</td>
                        <td>{assignment.comments}</td>
                        <td>
                          <a
                            href={assignment.fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View File
                          </a>
                        </td>
                        <td>
                          {assignment.submittedAt?.seconds
                            ? new Date(
                                assignment.submittedAt.seconds * 1000
                              ).toLocaleDateString()
                            : ""}
                        </td>

                        <td>
                          {assignment.status === "pending" ? (
                            <button
                              onClick={() => approveAssignment(assignment.id)}
                              disabled={assignment.status === "approved"}
                            >
                              {assignment.status === "pending"
                                ? "Approve"
                                : "✓ Approved"}
                            </button>
                          ) : (
                            <span>✓</span>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="8">No assignments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
        {(!isLoggedIn || isStudent) && (
          <section className="announcements">
          <h2><FontAwesomeIcon icon={faBullhorn} /> Important Announcements</h2>
          {announcements.length > 0 ? (
            announcements.map(({ id, title, message, postedAt }) => (
              <div className="announcement-card" key={id}>
                <h3>{title}</h3>
                <p>{message}</p>
                <span className="date-badge">Posted: {new Date(postedAt.seconds * 1000).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p>No announcements found.</p>
          )}
        </section>
        )}

        {isLoggedIn && isStudent && (
          <section className="assignment-section">
            <div className="assignment-form">
              <h2>
                <FontAwesomeIcon icon={faCalendarAlt} /> Submit Assignment
              </h2>
              {formError && <p className="error-message">{formError}</p>}
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Semester</label>
                  <select
                    value={assignSemester}
                    onChange={(e) => setAssignSemester(e.target.value)}
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">Select subject</option>
                    {availableSubjects.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Upload File</label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <div className="input-group">
                  <label>Comments</label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
                <button type="submit">Submit Assignment</button>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="institution-footer" id="help">
        <div className="footer-content">
          <div className="contact-info">
            <h4>Contact Us</h4>
            <p>Email: assignments@koshys.edu</p>
            <p>Phone: +91 80 1234 5678</p>
          </div>
          <div className="quick-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <button className="footer-link-btn">Academic Policy</button>
              </li>
              <li>
                <button className="footer-link-btn">
                  Submission Guidelines
                </button>
              </li>
              <li>
                <button className="footer-link-btn">FAQs</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; 2025 Koshys Group of Institution. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
