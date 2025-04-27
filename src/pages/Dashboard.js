import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    title: "",
    description: "",
    file: null,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.rollNo || !formData.title || !formData.file) {
      alert("Please fill in all required fields.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    console.log("Submitted:", formData);
    setSuccessMessage("✅ Assignment submitted successfully!");
    setFormData({ name: "", rollNo: "", title: "", description: "", file: null });
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📚 Assignment Submission</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="assignment-form">
        <div className="form-group">
          <label>Student Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Roll Number *</label>
          <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Assignment Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input type="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Upload File *</label>
          <input type="file" name="file" onChange={handleChange} required />
        </div>
        <button type="submit">Submit Assignment</button>
      </form>
    </div>
  );
};

export default Dashboard;
