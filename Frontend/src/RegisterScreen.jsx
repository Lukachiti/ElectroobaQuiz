import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("პაროლები არ ემთხვევა ერთმანეთს!");
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("რეგისტრაცია წარმატებით დასრულდა! ახლა შეგიძლიათ შეხვიდეთ. 🎉");
        navigate("/login");
      } else {
        setError(data.error || "რეგისტრაცია ჩავარდა");
      }
    } catch (err) {
      setError("სერვერთან კავშირი ვერ დამყარდა.");
    }
  };

  return (
    <div className="quiz-container" style={{ padding: "40px 20px", color: "white" }}>
      <div className="quiz-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>რეგისტრაცია 📝</h2>
        
        {error && <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="create-level-form">
          <label>ელ-ფოსტა:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>პაროლი:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label>გაიმეორეთ პაროლი:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

          <button type="submit" style={{ background: "#10b981", width: "100%", padding: "12px", fontWeight: "bold", marginTop: "10px" }}>
            რეგისტრაცია
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", opacity: 0.8 }}>
          უკვე გაქვთ ანგარიში? <Link to="/login" style={{ color: "#3b82f6" }}>შესვლა</Link>
        </p>
      </div>
    </div>
  );
}