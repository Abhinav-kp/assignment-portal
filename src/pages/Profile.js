// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import "./profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", course: "" });
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch student profile
        const docRef = doc(db, "students", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfile({ name: snap.data().name, course: snap.data().course });
        }

        // Fetch assignments for this student
        const q = query(
          collection(db, "assignments"),
          where("studentId", "==", user.uid),
          orderBy("submittedAt", "desc")
        );
        const snapShots = await getDocs(q);
        const list = snapShots.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setAssignments(list);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">{profile.name.charAt(0)}</div>
        <div className="profile-info">
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-course">Course: {profile.course}</p>
        </div>
      </div>

      <div className="assignments-section">
        <h2>Previous Submissions</h2>
        {assignments.length === 0 ? (
          <p className="no-assignments">No assignments submitted yet.</p>
        ) : (
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Semester</th>
                <th>Date</th>
                <th>Status</th>              {/* ← New column */}
                <th>File</th>
                
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.subject}</td>
                  <td>{a.semester}</td>
                  <td>
                    {new Date(
                      a.submittedAt.seconds * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    {a.status
                      ? a.status.charAt(0).toUpperCase() + a.status.slice(1)
                      : "Pending"}
                  </td>                {/* ← Render status, default to “Pending” */}
                  <td>
                    <a
                      href={a.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Profile;
