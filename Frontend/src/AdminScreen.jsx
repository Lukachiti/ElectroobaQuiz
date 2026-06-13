import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function AdminScreen() {
  const { token, user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetch('/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setRequests(data));
    }
  }, [token, user]);

  const handleAction = async (userId, approve) => {
    const res = await fetch('/api/admin/approve-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, approve })
    });

    if (res.ok) {
      setRequests(prev => prev.filter(req => req._id !== userId));
    }
  };

  if (!user?.isAdmin) return <h2 style={{color: 'white', textAlign: 'center'}}>წვდომა აკრძალულია!</h2>;

  return (
    <div className="quiz-container" style={{color: 'white', padding: '20px'}}>
      <h2>ადმინ პანელი 🛠️</h2>
      <p>მომხმარებლები, რომელთაც სურთ ტესტების დამატება:</p>
      {requests.length === 0 ? <p>მოთხოვნები არ არის.</p> : (
        requests.map(req => (
          <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', background: '#1e293b', padding: '10px', margin: '10px 0', borderRadius: '6px' }}>
            <span>{req.email}</span>
            <div>
              <button onClick={() => handleAction(req._id, true)} style={{background: 'green', color: 'white', marginRight: '10px', border: 'none', padding: '5px 10px', cursor: 'pointer'}}>დადასტურება</button>
              <button onClick={() => handleAction(req._id, false)} style={{background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer'}}>უარყოფა</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
