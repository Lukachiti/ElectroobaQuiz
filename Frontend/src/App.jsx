import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardScreen from "./DashboardScreen";
import QuizScreen from "./QuizScreen";
import CreateLevelScreen from "./CreateLevelScreen";
import AdminScreen from "./AdminScreen";

// 1. IMPORT YOUR AUTH SCREENS HERE
import LoginScreen from "./LoginScreen";       // Change path/name if different
import RegisterScreen from "./RegisterScreen"; // Change path/name if different

export default function App() {
  return (
    <Router>
      {/* Structural wrapper ensures layout styling doesn't break */}
      <div className="app-layout-wrapper">
        <Navbar /> 
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/quiz/:levelId" element={<QuizScreen />} />
            <Route path="/create-level" element={<CreateLevelScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
            
            {/* 2. ADD THE MISSING ROUTES HERE */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}