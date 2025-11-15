import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function AgentDetail() {
  const { agentUuid } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Determine where to link "Back" to. 
  // 'state' is passed from the <Link> component
  const from = location.state?.from || '/home'; // Default to /home

  useEffect(() => {
    async function fetchAgentDetail() {
      try {
        const url = `https://valorant-api.com/v1/agents/${agentUuid}`;
        const res = await axios.get(url);
        setAgent(res.data.data); 
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch agent details:", err);
        setError("Failed to load agent details. Please try again.");
        setLoading(false);
      }
    }

    fetchAgentDetail();
  }, [agentUuid]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  
  // --- Styles ---
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "white",
    padding: "40px",
    backgroundImage: `linear-gradient(rgba(13, 13, 13, 0.8), rgba(13, 13, 13, 0.8)), url(${agent?.background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  
  const contentStyle = {
      backgroundColor: "rgba(26, 26, 26, 0.9)",
      padding: "25px",
      borderRadius: "12px",
      border: "1px solid #e63946",
      maxWidth: "800px"
  };
  
  const abilityStyle = {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      margin: "20px 0",
      borderBottom: "1px solid #333",
      paddingBottom: "20px"
  };
  
  const abilityIconStyle = {
      width: "64px",
      height: "64px",
      backgroundColor: "#1a1a1a",
      border: "2px solid #e63946",
      borderRadius: "50%",
      padding: "5px"
  };
  
  const navButtonStyle = {
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
    textDecoration: "none"
  };
  // ----------------

  if (loading) {
    return <div style={{...containerStyle, backgroundImage: 'none'}}>Loading agent details...</div>;
  }

  if (error || !agent) {
    return <div style={{...containerStyle, color: "red", backgroundImage: 'none' }}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <Link to={from} style={{ color: "#e63946", fontWeight: "bold", textDecoration: "none" }}>
          &lt; Back
        </Link>
        <div>
            <button onClick={handleLogout} style={navButtonStyle}>
                Logout
            </button>
            {/* Profile Link REMOVED */}
        </div>
      </header>
      
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", gap: "30px", flexWrap: "wrap" }}>
        <img
          src={agent.fullPortrait}
          alt={agent.displayName}
          style={{ width: "300px", height: "auto", borderRadius: "8px" }}
        />
        <div style={contentStyle}>
            <h1 style={{color: "#e63946"}}>{agent.displayName}</h1>
            <h3 style={{fontStyle: "italic"}}>{agent.role.displayName}</h3>
            <p>{agent.description}</p>
        </div>
      </div>
      
      <div style={{...contentStyle, marginTop: "30px"}}>
          <h2>Abilities</h2>
          {agent.abilities.map(ability => (
              <div key={ability.slot} style={abilityStyle}>
                  {ability.displayIcon && (
                    <img src={ability.displayIcon} alt={ability.displayName} style={abilityIconStyle} />
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