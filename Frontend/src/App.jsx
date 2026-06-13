import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import DashboardScreen from "./DashboardScreen";
import QuizScreen from "./QuizScreen";
import CreateLevelScreen from "./CreateLevelScreen";
import AdminScreen from "./AdminScreen";

export default function App() {
  return (
    <Router>
      <Navbar /> {/* Displayed consistently on all viewpoints */}
      <Routes>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/quiz/:levelId" element={<QuizScreen />} />
        <Route path="/create-level" element={<CreateLevelScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
    </Router>
  );
}