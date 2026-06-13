import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (login) login(data.token, data.user);
        alert("წარმატებით შეხვედით! 🎉");
        navigate("/");
      } else {
        setError(data.error || "ავტორიზაცია ჩავარდა");
      }
    } catch (err) {
      setError("სერვერთან კავშირი ვერ დამყარდა.");
    }
  };

  return (
    <div className="quiz-container" style={{ padding: "40px 20px", color: "white" }}>
      <div className="quiz-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>სისტემაში შესვლა 🔑</h2>
        
        {error && <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="create-level-form">
          <label>ელ-ფოსტა:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>პაროლი:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" style={{ background: "#2563eb", width: "100%", padding: "12px", fontWeight: "bold", marginTop: "10px" }}>
            შესვლა
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", opacity: 0.8 }}>
          არ გაქვთ ანგარიში? <Link to="/register" style={{ color: "#3b82f6" }}>დარეგისტრირდით</Link>
        </p>
      </div>
    </div>
  );
}