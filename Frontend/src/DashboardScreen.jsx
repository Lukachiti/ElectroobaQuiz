import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // To check if user is logged in

export default function DashboardScreen() {
  const { user, token } = useContext(AuthContext);
  const [defaultLevels, setDefaultLevels] = useState([]);
  const [communityLevels, setCommunityLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState(user?.status || 'none');

  useEffect(() => {
    // Fetch all levels from your Node/Express backend
    fetch("http://localhost:5000/api/levels")
      .then((res) => res.json())
      .then((data) => {
        // Filter the levels based on their database category field
        setDefaultLevels(data.filter(level => level.category === 'default'));
        setCommunityLevels(data.filter(level => level.category === 'community'));
        setLoading(false)
      })
      .catch(err => console.error("Error loading levels:", err));
  }, []);

  // Handle requesting creator permissions from Admin
  const handleRequestCreator = async () => {
    const res = await fetch("http://localhost:5000/api/user/request-creator", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setRequestStatus('requested');
      alert("მოთხოვნა გაიგზავნა ადმინისტრატორთან!");
    }
  };

  if (loading) return <div style={{ color: "white", textAlign: "center" }}>იტვირთება...</div>;

  return (
    <div className="dashboard-wrapper" style={{ color: "white", padding: "20px" }}>
      
      {/* Creator Permission Request Banner */}
      {user && !user.isAdmin && !user.canCreateLevels && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {requestStatus === 'none' && (
            <button className="btn-request" onClick={handleRequestCreator}>
              მოითხოვე ტესტების დამატების უფლება 📝
            </button>
          )}
          {requestStatus === 'requested' && <p style={{ color: '#fbbf24' }}>⌛ მოთხოვნა განხილვაშია ადმინ ლუკას მიერ...</p>}
          {requestStatus === 'rejected' && <p style={{ color: '#ef4444' }}>❌ თქვენი მოთხოვნა უარყოფილია.</p>}
        </div>
      )}

      {user?.canCreateLevels && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link to="/create-level" className="btn-create">ქვიზის დამატება ➕</Link>
        </div>
      )}

      {/* 1. Default Levels Section */}
      <h3>Default Levels</h3>
      <div className="levels-grid">
        {defaultLevels.map((level) => (
          <div key={level._id} className="level-card">
            <h4>{level.title}</h4>
            <Link to={`/quiz/${level._id}`} className="btn-play">დაწყება</Link>
          </div>
        ))}
      </div>

      {/* 2. Community Levels Section */}
      <h3 style={{ marginTop: '40px' }}>Community Levels</h3>
      <div className="levels-grid">
        {communityLevels.length === 0 ? <p>ტესტები არ არის დამატებული</p> : (
          communityLevels.map((level) => (
            <div key={level._id} className="level-card community">
              <h4>{level.title}</h4>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>ავტორი: {level.creator?.email || 'Unknown'}</p>
              <Link to={`/quiz/${level._id}`} className="btn-play">დაწყება</Link>
            </div>
          ))
        )}
      </div>

    </div>
  );
}