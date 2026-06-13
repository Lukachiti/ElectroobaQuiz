import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function DashboardScreen() {
  const { user, token, setUser } = useContext(AuthContext) || {};
  const [defaultLevels, setDefaultLevels] = useState([]);
  const [communityLevels, setCommunityLevels] = useState([]);
  const [loadingLevels, setLoadingLevels] = useState(true);

  useEffect(() => {
    fetch("/api/levels")
      .then((res) => res.json())
      .then((data) => {
        setDefaultLevels(data.filter(level => level.category === 'default'));
        setCommunityLevels(data.filter(level => level.category === 'community'));
        setLoadingLevels(false);
      })
      .catch(err => {
        console.error("Error loading levels:", err);
        setLoadingLevels(false);
      });
  }, []);

  const handleRequestCreator = async () => {
    const res = await fetch("/api/user/request-creator", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      // Instantly update localized state context layout
      const updatedUser = { ...user, status: 'requested' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if(setUser) setUser(updatedUser);
      alert("მოთხოვნა გაიგზავნა ადმინისტრატორთან!");
    }
  };

  return (
    <div className="dashboard-wrapper" style={{ color: "white", padding: "20px" }}>
      
      {/* 1. Interface Elements and Banners Render Instantly */}
      <div className="dashboard-intro" style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.5rem" }}>კომპიუტერული ტესტები 🖥️</h1>
        <p style={{ opacity: 0.8 }}>აირჩიეთ სირთულის დონე. დასრულებული დონის გადაბარება შეუძლებელია!</p>
        
        {user && !user.isAdmin && !user.canCreateLevels && (
          <div style={{ marginTop: "20px" }}>
            {user.status === 'none' || !user.status ? (
              <button className="btn-request" onClick={handleRequestCreator}>
                მოითხოვე ტესტების დამატების უფლება 📝
              </button>
            ) : user.status === 'requested' ? (
              <p style={{ color: '#fbbf24' }}>⌛ მოთხოვნა განხილვაშია ადმინ ლუკას მიერ...</p>
            ) : (
              <p style={{ color: '#ef4444' }}>❌ თქვენი მოთხოვნა უარყოფილია.</p>
            )}
          </div>
        )}
      </div>

      {/* 2. Default Levels Section */}
      <h3>Default Levels</h3>
      {loadingLevels ? (
        <div className="loading-placeholder">იტვირთება დონეები... ⌛</div>
      ) : (
        <div className="levels-grid">
          {defaultLevels.map((level) => (
            <div key={level._id} className="level-card">
              <h4>{level.title}</h4>
              <Link to={`/quiz/${level._id}`} className="btn-play">დაწყება</Link>
            </div>
          ))}
        </div>
      )}

      {/* 3. Community Levels Section */}
      <h3 style={{ marginTop: '40px' }}>Community Levels</h3>
      {loadingLevels ? (
        <div className="loading-placeholder">იტვირთება საზოგადოებრივი ტესტები... ⌛</div>
      ) : (
        <div className="levels-grid">
          {communityLevels.length === 0 ? <p style={{ opacity: 0.6 }}>ტესტები არ არის დამატებული</p> : (
            communityLevels.map((level) => (
              <div key={level._id} className="level-card community">
                <h4>{level.title}</h4>
                <p style={{ fontSize: '11px', opacity: 0.6 }}>ავტორი: {level.creator?.email || 'სისტემა'}</p>
                <Link to={`/quiz/${level._id}`} className="btn-play">დაწყება</Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}