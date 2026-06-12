import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { levelsData } from "./quizData";
import {CustomLevelData} from "./customLevelData";

export default function DashboardScreen() {
  const [scores, setScores] = useState({});

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("quiz_scores")) || {};
    setScores(savedScores);
  }, []);

  return (
    <div className="quiz-container container-fade-in">
      <div className="dashboard-header">
        <h1>კომპიუტერული ტესტები 🖥️</h1>
        <p>აირჩიეთ სირთულის დონე. დასრულებული დონის გადაბარება შეუძლებელია!</p>
      </div>

      <div className="titlee">
        <h2>Default Levels</h2>
        <div className="levels-grid">
          {Object.keys(levelsData).map((lvl) => {
            const isCompleted = scores[lvl] !== undefined;
            const displayScore = scores[lvl];

            return isCompleted ? (
              <div key={lvl} className="level-card locked">
                <div className="lock-icon">🔒 ჩაკეტილია</div>
                <h3 className="level-title">{lvl.toUpperCase()}</h3>
                <p className="level-status">ტესტი დასრულებულია</p>
                <div className="saved-score-badge">ქულა: {displayScore}</div>
              </div>
            ) : (
              <Link key={lvl} to={`/quiz/${lvl}`} className="level-card active">
                <div className="unlock-icon">🔓 ღიაა</div>
                <h3 className="level-title">{lvl.toUpperCase()}</h3>
                <p className="level-status">
                  შეკითხვები: {levelsData[lvl].length}
                </p>
                <span className="btn-start-level">დაწყება</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="titleee">
        <h2>Community Levels</h2>
        <div className="levels-grid">
          {Object.keys(CustomLevelData).map((lvl) => {
            const isCompleted = scores[lvl] !== undefined;
            const displayScore = scores[lvl];

            return isCompleted ? (
              <div key={lvl} className="level-card locked">
                <div className="lock-icon">🔒 ჩაკეტილია</div>
                <h3 className="level-title">{lvl.toUpperCase()}</h3>
                <p className="level-status">ტესტი დასრულებულია</p>
                <div className="saved-score-badge">ქულა: {displayScore}</div>
              </div>
            ) : (
              <Link key={lvl} to={`/quiz/${lvl}`} className="level-card active">
                <div className="unlock-icon">🔓 ღიაა</div>
                <h3 className="level-title">{lvl.toUpperCase()}</h3>
                <p className="level-status">
                  შეკითხვები: {CustomLevelData[lvl].length}
                </p>
                <span className="btn-start-level">დაწყება</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
