import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="site-navbar">
      <div className="navbar-brand">
        <Link to="/">კომპიუტერული ტესტები 🖥️</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">მთავარი</Link>
        
        {user ? (
          <>
            {/* If user has approval or is Admin, show creation link */}
            {user.canCreateLevels && (
              <Link to="/create-level" className="nav-link btn-highlight">ტესტის დამატება ➕</Link>
            )}

            {/* If user is Admin Luka, show Admin panel link */}
            {user.isAdmin && (
              <Link to="/admin" className="nav-link btn-admin">ადმინ პანელი 🛠️</Link>
            )}

            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="btn-logout">გამოსვლა 🚪</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">შესვლა</Link>
            <Link to="/register" className="nav-link">რეგისტრაცია</Link>
          </>
        )}
      </div>
    </nav>
  );
}