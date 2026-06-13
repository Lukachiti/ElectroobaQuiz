import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
  const logout = auth?.logout;
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  return (
    <nav className="site-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">კომპიუტერული ტესტები 🖥️</Link>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">მთავარი</Link>
          
          {user ? (
            <>
              {user.canCreateLevels && (
                <Link to="/create-level" className="nav-link btn-highlight">ტესტის დამატება ➕</Link>
              )}
              {user.isAdmin && (
                <Link to="/admin" className="nav-link btn-admin">ადმინ პანელი 🛠️</Link>
              )}
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="btn-logout">გამოსვლა 🚪</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn-auth">შესვლა</Link>
              <Link to="/register" className="nav-link btn-auth register-border">რეგისტრაცია</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}