import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstitutionPortal from './pages/InstitutionPortal/InstitutionPortal';
import StudentLogin from './pages/Login/StudentLogin';
import FacultyLogin from './pages/Login/FacultyLogin'
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Profile from './pages/Profile/Profile';
import FacultyAccountCreate from './pages/CreateAccount/FacultyAccountCreate';
import AdminLogin from './pages/Admin/AdminLogin';
import Admin from './pages/Admin/Admin';
import ProtectedRoute from './protectedRoute';
import "./App.css"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<InstitutionPortal />} />
        <Route path="/student-login" element={<StudentLogin />} /> {/* Correct case */}
        <Route path="/faculty-login" element={<FacultyLogin/>}/>
        <Route path="/admin-login" element={<AdminLogin/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/create-account" element={<CreateAccount/>}/>
        <Route path="/create-faculty" element={<FacultyAccountCreate/>}/>
        <Route
         path="/admin-dashboard"
         element={
           <ProtectedRoute>
             <Admin />
           </ProtectedRoute>
         }
       />        
      </Routes>
    </Router>
    </>
  );
}

export default App;
