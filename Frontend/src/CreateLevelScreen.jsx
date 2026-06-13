import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function CreateLevelScreen() {
  const { user, token } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("community"); 
  const [questions, setQuestions] = useState([
    { question: "", answers: ["", "", ""], correctAnswer: "", timeToThink: 15, maxScore: 100 }
  ]);

  // Block unauthorized users immediately
  if (!user?.canCreateLevels) {
    return <h2 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>წვდომა შეზღუდულია! ტესტის დასამატებლად საჭიროა უფლება.</h2>;
  }

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex] = value;
    setQuestions(updated);
  };

  const addAnswerSlot = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.push("");
    setQuestions(updated);
  };

  const addQuestionBlock = () => {
    setQuestions([
      ...questions,
      { question: "", answers: ["", "", ""], correctAnswer: "", timeToThink: 15, maxScore: 100 }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick Form Validation
    if (!title.trim()) return alert("გთხოვთ მიუთითოთ ტესტის სახელი!");
    
    const response = await fetch("/api/levels/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, category, questions })
    });

    if (response.ok) {
      alert("ტესტი წარმატებით დაემატა ბაზაში! 🎉");
      navigate("/");
    } else {
      alert("ტესტის დამატება ჩავარდა.");
    }
  };

  return (
    <div className="quiz-container" style={{ color: "white", padding: "20px" }}>
      <h2>ახალი ტესტის შექმნა 📝</h2>
      <form onSubmit={handleSubmit} className="create-level-form">
        <label>ტესტის სათაური (მაგ: CARS, HARD):</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        {user.isAdmin && (
          <>
            <label>კატეგორია:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="community">Community Level</option>
              <option value="default">Default Level (Admin Only)</option>
            </select>
          </>
        )}

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-build-box" style={{ background: "#1e293b", padding: "15px", margin: "20px 0", borderRadius: "8px" }}>
            <h4>შეკითხვა {qIndex + 1}</h4>
            <input 
              type="text" 
              placeholder="ჩაწერეთ კითხვა..." 
              value={q.question} 
              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)} 
              required 
            />

            <label>სავარაუდო პასუხები:</label>
            {q.answers.map((ans, aIndex) => (
              <input 
                key={aIndex}
                type="text" 
                placeholder={`პასუხი ${aIndex + 1}`} 
                value={ans} 
                onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)} 
                required 
              />
            ))}
            <button type="button" onClick={() => addAnswerSlot(qIndex)} style={{ background: "#475569", margin: "5px 0" }}>+ პასუხის ვარიანტი</button>

            <label>სწორი პასუხი (უნდა ემთხვეოდეს ზედა ვარიანტებიდან ერთ-ერთს):</label>
            <input 
              type="text" 
              placeholder="კოპირება გაუკეთეთ სწორ პასუხს აქ..." 
              value={q.correctAnswer} 
              onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)} 
              required 
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <div>
                <label>დრო (წამებში):</label>
                <input type="number" value={q.timeToThink} onChange={(e) => handleQuestionChange(qIndex, "timeToThink", parseInt(e.target.value))} />
              </div>
              <div>
                <label>მაქსიმალური ქულა:</label>
                <input type="number" value={q.maxScore} onChange={(e) => handleQuestionChange(qIndex, "maxScore", parseInt(e.target.value))} />
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addQuestionBlock} style={{ background: "#2563eb", width: "100%", margin: "10px 0" }}>+ შეკითხვის დამატება</button>
        <button type="submit" style={{ background: "#16a34a", width: "100%", padding: "12px", fontWeight: "bold" }}>ტესტის ბაზაში შენახვა 🚀</button>
      </form>
    </div>
  );
}