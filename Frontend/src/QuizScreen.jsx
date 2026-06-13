import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function QuizScreen() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // States for fetching and handling runtime quiz metrics
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentScorePotential, setCurrentScorePotential] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const timerRef = useRef(null);

  // 1. უსაფრთხოების შემოწმება & მონაცემების წამოღება ბაზიდან
  useEffect(() => {
    // თუ მომხმარებელი უკვე შემოწმდა ლოკალურად ქულებზე (სურვილისამებრ)
    const savedScores = JSON.parse(localStorage.getItem("quiz_scores")) || {};
    if (savedScores[levelId] !== undefined) {
      navigate("/", { replace: true });
      return;
    }

    // ვქაჩავთ ტესტს მონაცემთა ბაზიდან relative path-ის გამოყენებით (Vercel-ისთვის)
    fetch("/api/levels")
      .then((res) => res.json())
      .then((data) => {
        // ვპოულობთ მიმდინარე დონეს ID-ს მიხედვით
        const currentLevel = data.find((lvl) => lvl._id === levelId);
        if (currentLevel) {
          setQuestions(currentLevel.questions || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading quiz from database:", err);
        setLoading(false);
      });
  }, [levelId, navigate]);

  // 2. თაიმერის მართვა ყოველი კითხვის შეცვლისას
  useEffect(() => {
    if (questions.length === 0) return;

    if (currentIndex >= questions.length) {
      // ქულის შენახვა ტესტის დასრულებისას
      const savedScores = JSON.parse(localStorage.getItem("quiz_scores")) || {};
      savedScores[levelId] = totalScore;
      localStorage.setItem("quiz_scores", JSON.stringify(savedScores));
      
      setQuizComplete(true);
      return;
    }

    const currentQuestion = questions[currentIndex];
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
  }, [currentIndex, questions, levelId, totalScore]);

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

    const currentQuestion = questions[currentIndex];
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setTotalScore((prev) => prev + currentScorePotential);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
  };

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>იტვირთება ქვიზი... ⌛</div>;
  }

  if (questions.length === 0) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <h2>ტესტი ვერ მოიძებნა! ❌</h2>
        <button className="btn-restart" onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
          მთავარ გვერდზე დაბრუნება
        </button>
      </div>
    );
  }

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

  const currentQuestion = questions[currentIndex];
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
            შეკითხვა <strong>{currentIndex + 1}</strong> / {questions.length}-დან
          </div>
          <div className="score-display">
            ქულა: <span>{totalScore}</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className={`quiz-card ${isCorrect ? "correct-animation" : ""}`}>
          <div className="card-top">
            <div className="score-potential">
              შესაძლო ქულა: <span>{currentScorePotential}</span>
            </div>

          <div className="timer-svg-wrapper">
            <svg width="60" height="60" className="timer-svg">
              <circle cx="30" cy="30" r={radius} className="timer-circle-bg" />
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="timer-circle-fill"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: isNaN(strokeDashoffset) ? 0 : strokeDashoffset,
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
          <div className={`feedback-banner ${isCorrect ? "text-success" : "text-danger"}`}>
            {isCorrect 
              ? `სწორია! +${currentScorePotential} ქულა` 
              : selectedAnswer === "" 
                ? "დრო ამოიწურა!" 
                : "არასწორია!"
            }
          </div>
        )}
      </div>
    </div>
  </div>
  );
}