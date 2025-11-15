import { useEffect, useState } from "react";
import axios from "axios"; // Keep for valorant-api
import api from "../api"; // <-- IMPORT THIS
import { Link } from "react-router-dom";

const AGENT_ROLES = ["All", "Duelist", "Initiator", "Controller", "Sentinel"];

export default function Home() {
  const [allAgents, setAllAgents] = useState([]); 
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  // const token = localStorage.getItem("token"); // No longer needed here

  useEffect(() => {
    // This is external, so axios is fine
    axios
      .get("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then((res) => {
        setAllAgents(res.data.data);
        setFilteredAgents(res.data.data); 
      });

    // This is your backend, use 'api'
    api
      .get("/api/favorites/") // No headers needed, api.js handles it
      .then((res) => setFavorites(res.data));
  }, []); // token dependency removed

  useEffect(() => {
    let tempAgents = [...allAgents];
    if (selectedRole !== "All") {
      tempAgents = tempAgents.filter(
        (agent) => agent.role.displayName === selectedRole
      );
    }
    if (searchTerm) {
      tempAgents = tempAgents.filter((agent) =>
        agent.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAgents(tempAgents);
  }, [searchTerm, selectedRole, allAgents]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh"); // Also remove refresh token
    window.location.href = "/";
  };

  const toggleFavorite = async (agent) => {
    const exists = favorites.find((f) => f.agent_uuid === agent.uuid);
    if (exists) {
      // Use 'api' and relative URL
      await api.delete(`/api/favorites/${exists.id}/`);
      setFavorites(favorites.filter((f) => f.agent_uuid !== agent.uuid));
    } else {
      // Use 'api' and relative URL
      const res = await api.post("/api/favorites/", { 
        agent_uuid: agent.uuid, 
        agent_name: agent.displayName 
      });
      setFavorites([...favorites, res.data]);
    }
  };

  // --- Styles (Your styles are unchanged) ---
  const cardStyle = {
    margin: "10px",
    border: "2px solid #e63946",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    width: "140px",
    backgroundColor: "#1a1a1a",
    color: "white",
    transition: "transform 0.2s, box-shadow 0.2s",
  };
  const cardHover = {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #e63946",
  };
  const linkContentStyle = {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  };
  const filterContainerStyle = {
    padding: "20px 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  };
  const searchInputStyle = {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    borderRadius: "5px",
    border: "2px solid #ff4655",
    background: "#1a1a1d",
    color: "white",
    fontSize: "16px",
  };
  const roleFilterContainerStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
  };
  const roleButtonStyle = {
    backgroundColor: "#1a1a1a",
    color: "white",
    border: "2px solid #e63946",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  };
  const activeRoleButtonStyle = {
    ...roleButtonStyle,
    backgroundColor: "#e63946",
    boxShadow: "0px 0px 10px #e63946",
    color: "white",
  };
  const navButtonStyle = {
      backgroundColor: "#e63946",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "10px",
      textDecoration: "none",
      fontSize: '14px'
  };
  const greenButtonStyle = {
      ...navButtonStyle,
      backgroundColor: "#06d6a0",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        backgroundImage:
          "url('https://images4.alphacoders.com/126/thumb-1920-1264065.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        color: "white",
        padding: "20px",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', flexWrap: 'wrap' }}>
        <h1 style={{marginRight: '20px'}}>Valorant Tracker</h1>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
          <button onClick={handleLogout} style={navButtonStyle}>
            Logout
          </button>
          
          <Link to="/top-agents" style={greenButtonStyle}> 
            Top Agents
          </Link>
          
          {/* --- Top Weapons Link --- */}
          <Link to="/top-weapons" style={greenButtonStyle}>
            Top Weapons
          </Link>
          
          <Link to="/weapons" style={greenButtonStyle}>
            Weapons
          </Link>
          
          <Link to="/favorites" style={navButtonStyle}>
            My Fave Agents
          </Link>
          
          {/* --- Favorite Weapons Link --- */}
          <Link to="/favorite-weapons" style={navButtonStyle}>
            My Fave Weapons
          </Link>
          
        </div>
      </header>
      
      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Search agents..."
          style={searchInputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div style={roleFilterContainerStyle}>
          {AGENT_ROLES.map(role => (
            <button
              key={role}
              style={selectedRole === role ? activeRoleButtonStyle : roleButtonStyle}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <h2 style={{ marginTop: "20px" }}>Agents</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => {
            const isFav = favorites.some((f) => f.agent_uuid === agent.uuid);
            return (
              <div
                key={agent.uuid}
                style={cardStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, cardHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, cardStyle)
                }
              >
                <Link 
                  to={`/agent/${agent.uuid}`} 
                  state={{ from: 'home' }} 
                  style={linkContentStyle}
                >
                  <img
                    src={agent.displayIcon}
                    alt={agent.displayName}
                    width="100"
                    height="100"
                    style={{ borderRadius: "5px" }}
                  />
                  <p style={{ fontWeight: "bold" }}>{agent.displayName}</p>
                </Link>

                <button
                  onClick={() => toggleFavorite(agent)}
                  style={{
                    backgroundColor: isFav ? "#f1faee" : "#e63946",
                    color: isFav ? "#e63946" : "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  {isFav ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            );
          })
        ) : (
          <p>No agents match your criteria.</p>
        )}
      </div>
    </div>
  );
}