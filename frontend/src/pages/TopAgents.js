import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TopAgents() {
  const [topAgents, setTopAgents] = useState([]);
  const [allAgents, setAllAgents] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTopAgents() {
      try {
        // 1. Fetch all agent data for images
        const agentsRes = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
        );
        const agentsMap = agentsRes.data.data.reduce((map, agent) => {
          map[agent.uuid] = agent;
          return map;
        }, {});
        setAllAgents(agentsMap);

        // 2. Fetch top favorited agents
        const topRes = await axios.get("http://127.0.0.1:8000/api/favorites/top/");
        setTopAgents(topRes.data);
      } catch (err) {
        console.error("Failed to load top agents", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopAgents();
  }, []);

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
    backgroundImage: "url('https://images4.alphacoders.com/126/thumb-1200-1264065.png')",
    backgroundSize: "cover",
  };
  const cardStyle = {
    margin: "10px",
    border: "2px solid #e63946",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    width: "140px",
    backgroundColor: "#1a1a1a",
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
    return <div style={containerStyle}>Loading Top Agents...</div>;
  }

  return (
    <div style={containerStyle}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <h1>Top Favorited Agents</h1>
        <div>
          <button onClick={handleLogout} style={navButtonStyle}>
            Logout
          </button>
          <Link to="/home" style={navButtonStyle}>
            Back to Home
          </Link>
        </div>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "30px" }}>
        {topAgents.length > 0 ? (
          topAgents.map((agent, index) => {
            const agentData = allAgents[agent.agent_uuid];
            return agentData ? (
              <div key={agent.agent_uuid} style={cardStyle}>
                <h2 style={{ color: "#ff4655" }}>#{index + 1}</h2>
                <Link to={`/agent/${agent.agent_uuid}`} state={{ from: '/top-agents' }}>
                  <img
                    src={agentData.displayIcon}
                    alt={agentData.displayName}
                    width="100"
                    height="100"
                    style={{ borderRadius: "5px" }}
                  />
                  <p style={{ fontWeight: "bold", color: "white", textDecoration: "none" }}>{agentData.displayName}</p>
                </Link>
                <p style={{ color: "#ff4655", fontWeight: "bold" }}>{agent.count} Favorites</p>
              </div>
            ) : null; // Don't render if agent data not found
          })
        ) : (
          <p>No agents have been favorited yet!</p>
        )}
      </div>
    </div>
  );
}