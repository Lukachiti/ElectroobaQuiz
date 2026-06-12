import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardScreen from "./DashboardScreen";
import QuizScreen from "./QuizScreen";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/quiz/:levelId" element={<QuizScreen />} />
      </Routes>
    </Router>
  );
}