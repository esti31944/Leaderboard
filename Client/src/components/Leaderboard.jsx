
import React, { useEffect, useState } from "react";
import "../css/leaderboard.css"

export default function Leaderboard() {
  const [bottomPlayers, setBottomPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newScore, setNewScore] = useState("");

  const fetchPlayers = () => {
    // שלושת בעלי הניקוד הנמוך ביותר
    fetch("http://localhost:3006/players/bottom/3")
      .then(res => res.json())
      .then(data => setBottomPlayers(data))
      .catch(err => console.error(err));


    fetch("http://localhost:3006/players/top/20")
      .then(res => res.json())
      .then(data => setAllPlayers(data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  const startEditing = (id, currentScore) => {
    setEditingId(id);
    setNewScore(currentScore);
  };

  const saveScore = async (id) => {
    const scoreInt = parseInt(newScore, 10);
    if (isNaN(scoreInt)) return alert("Enter a valid number");

    try {
      await fetch(`http://localhost:3006/players/score/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: scoreInt })
      });
      setEditingId(null);
      setNewScore("");
      fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePlayer = async (id) => {
    try {
      await fetch(`http://localhost:3006/players/${id}`, { method: "DELETE" });
      fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="leaderboard-container">
      <h1 className="title">🏆 Top Cats!</h1>

      {/* כפתור רענון */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <button onClick={fetchPlayers} style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}>
          Refresh
        </button>
      </div>

      {/* שלושת הנמוכים ביותר */}
      <div className="top-row">
        {bottomPlayers.map((p, i) => (
          <div key={p._id} className="player-card">
            <img src={p.imgUrl} alt={p.name} className="player-img" />
            <h3>{p.name}</h3>
            <p className="score">{p.score}</p>
          </div>
        ))}
      </div>

      {/* כל השחקנים */}
      <div className="all-players">
        <h2>All Players</h2>
        <ul>
          {allPlayers.map((p, index) => (
            <li key={p._id} className="player-item">
              <span className="rank">{index + 1}</span>
              <img src={p.imgUrl} alt={p.name} className="list-img" />
              <span className="name">{p.name}</span>

              {editingId === p._id ? (
                <>
                  <input
                    type="number"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    style={{ width: "50px", marginRight: "5px" }}
                  />
                  <button onClick={() => saveScore(p._id)}>SAVE</button>
                </>
              ) : (
                <button onClick={() => startEditing(p._id, p.score)}>UPDATE</button>
              )}

              <button onClick={() => deletePlayer(p._id)}>DELETE</button>
              <span className="score">{p.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
