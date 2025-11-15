import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading"; // <-- Import Loading

export default function AgentDetail() {
  const { agentUuid } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const from = location.state?.from || '/home';

  useEffect(() => {
    async function fetchAgentDetail() {
      try {
        const url = `https://valorant-api.com/v1/agents/${agentUuid}`;
        const res = await axios.get(url);
        setAgent(res.data.data); 
      } catch (err) {
        console.error("Failed to fetch agent details:", err);
        setError("Failed to load agent details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAgentDetail();
  }, [agentUuid]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };
  
  // Use dynamic background image
  const containerStyle = {
    backgroundImage: agent ? 
      `linear-gradient(rgba(13, 13, 13, 0.8), rgba(13, 13, 13, 0.8)), url(${agent.background})` : 
      'none',
  };
  
  if (loading) {
    return (
      <div className="val-container">
        <Loading />
      </div>
    );
  }

  if (error || !agent) {
    return <div className="val-container">{error || "Agent not found."}</div>;
  }

  return (
    <div className="val-container" style={containerStyle}>
      <header className="val-header" style={{borderBottom: 'none', marginBottom: 0}}>
        <Link to={from} className="val-button">
          &lt; Back
        </Link>
        <div>
            <button onClick={handleLogout} className="val-button">
                Logout
            </button>
        </div>
      </header>
      
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", gap: "30px", flexWrap: "wrap" }}>
        <img
          src={agent.fullPortrait}
          alt={agent.displayName}
          style={{ width: "300px", height: "auto", borderRadius: "8px" }}
        />
        <div className="val-detail-content">
            <h1>{agent.displayName}</h1>
            <h3>{agent.role.displayName}</h3>
            <p>{agent.description}</p>
        </div>
      </div>
      
      <div className="val-detail-content" style={{marginTop: "30px"}}>
          <h2>Abilities</h2>
          {agent.abilities.map(ability => (
              <div key={ability.slot} className="val-ability-card">
                  {ability.displayIcon && (
                    <img src={ability.displayIcon} alt={ability.displayName} className="val-ability-icon" />
                  )}
                  <div>
                      <h4>{ability.displayName}</h4>
                      <p style={{fontSize: '14px', color: '#ccc'}}>{ability.description}</p>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}