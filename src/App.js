import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstitutionPortal from './InstitutionPortal';
import StudentLogin from './StudentLogin';
import FacultyLogin from './FacultyLogin'
import Dashboard from "./pages/Dashboard";
import CreateAccount from './pages/CreateAccount';
import Profile from './pages/Profile';
import FacultyAccountCreate from './pages/FacultyAccountCreate';
import AdminLogin from './pages/AdminLogin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InstitutionPortal />} />
        <Route path="/student-login" element={<StudentLogin />} /> {/* Correct case */}
        <Route path="/faculty-login" element={<FacultyLogin/>}/>
        <Route path="/admin-login" element={<AdminLogin/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/create-account" element={<CreateAccount/>}/>
        <Route path="/create-faculty" element={<FacultyAccountCreate/>}/>
        
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ After login */}
      </Routes>
    </Router>
  );
}

export default App;
