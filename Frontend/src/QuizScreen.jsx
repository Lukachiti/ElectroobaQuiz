import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { levelsData } from "./quizData";
import { CustomLevelData } from "./customLevelData";

export default function QuizScreen() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  
  const { levelId } = useParams();
const [combinedQuizData, setCombinedQuizData] = useState([]);

useEffect(() => {
  fetch(`http://localhost:5000/api/levels`)
    .then(res => res.json())
    .then(data => {
      // Find the current level matching the database _id
      const currentLevel = data.find(lvl => lvl._id === levelId);
      if (currentLevel) {
        setCombinedQuizData(currentLevel.questions);
      }
    });
}, [levelId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentScorePotential, setCurrentScorePotential] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const timerRef = useRef(null);

  // უსაფრთხოების შემოწმება: თუ ეს დონე უკვე გავლილია, აგდებს მთავარ გვერდზე
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("quiz_scores")) || {};
    if (savedScores[levelId] !== undefined) {
      navigate("/", { replace: true });
    }
  }, [levelId, navigate]);

  // Handling Question Transitions and Timer Intervals
  useEffect(() => {
    if (combinedQuizData.length === 0) return;

    if (currentIndex >= combinedQuizData.length) {
      // ქულის სამუდამოდ შენახვა ტესტის დასრულებისას
      const savedScores = JSON.parse(localStorage.getItem("quiz_scores")) || {};
      savedScores[levelId] = totalScore;
      localStorage.setItem("quiz_scores", JSON.stringify(savedScores));

      setQuizComplete(true);
      return;
    }

    const currentQuestion = combinedQuizData[currentIndex];
    setTimeLeft(currentQuestion.timeToThink);
    setCurrentScorePotential(currentQuestion.maxScore);
    setSelectedAnswer(null);
    setIsCorrect(null);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prevTime - 1;
      });

      setCurrentScorePotential((prevScore) => Math.max(0, prevScore - 1));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, combinedQuizData, levelId]);

  const handleTimeOut = () => {
    setSelectedAnswer("");
    setIsCorrect(false);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
  };

  const handleAnswerSelection = (answer) => {
    if (selectedAnswer !== null) return;

    clearInterval(timerRef.current);
    setSelectedAnswer(answer);

    const currentQuestion = combinedQuizData[currentIndex];
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setTotalScore((prev) => prev + currentScorePotential);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
  };

  if (quizComplete) {
    return (
      <div className="quiz-screen-wrapper">
        <div className="quiz-container container-fade-in">
          <div className="quiz-card end-card">
            <h2>გილოცავთ! ტესტი დასრულდა 🎉</h2>
            <p className="final-score-label">თქვენი საბოლოო ქულა</p>
            <div className="final-score-badge">{totalScore}</div>
            <button className="btn-restart" onClick={() => navigate("/")}>
              მთავარ გვერდზე დაბრუნება
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = combinedQuizData[currentIndex];
  if (!currentQuestion) return null;

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (timeLeft / currentQuestion.timeToThink) * circumference;

  return (
    <div className="quiz-screen-wrapper">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="progress-text">
            შეკითხვა <strong>{currentIndex + 1}</strong> /{" "}
            {combinedQuizData.length}-დან
          </div>
          <div className="score-display">
            ქულა: <span>{totalScore}</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${((currentIndex + 1) / combinedQuizData.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className={`quiz-card ${isCorrect ? "correct-animation" : ""}`}>
          <div className="card-top">
            <div className="score-potential">
              შესაძლო ქულა: <span>{currentScorePotential}</span>
            </div>

            <div className="timer-svg-wrapper">
              <svg width="60" height="60" className="timer-svg">
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  className="timer-circle-bg"
                />
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  className="timer-circle-fill"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: isNaN(strokeDashoffset)
                      ? 0
                      : strokeDashoffset,
                  }}
                />
              </svg>
              <span className="timer-text">{timeLeft}</span>
            </div>
          </div>

          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="answers-grid">
            {currentQuestion.answers.map((answer, index) => {
              let btnClass = "btn-answer";
              if (selectedAnswer !== null) {
                if (answer === currentQuestion.correctAnswer) {
                  btnClass += " correct-reveal";
                } else if (selectedAnswer === answer && !isCorrect) {
                  btnClass += " wrong-reveal";
                } else {
                  btnClass += " disabled";
                }
              }

              return (
                <button
                  key={index}
                  className={btnClass}
                  onClick={() => handleAnswerSelection(answer)}
                  disabled={selectedAnswer !== null}
                >
                  {answer}
                </button>
              );
            })}
          </div>

          {isCorrect !== null && (
            <div
              className={`feedback-banner ${isCorrect ? "text-success" : "text-danger"}`}
            >
              {isCorrect
                ? `სწორია! +${currentScorePotential} ქულა`
                : selectedAnswer === ""
                  ? "დრო ამოიწურა!"
                  : "არასწორია!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
