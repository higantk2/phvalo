import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";
import Loading from "../components/Loading"; // <-- Import Loading

export default function TopAgents() {
  const [topAgents, setTopAgents] = useState([]);
  const [allAgents, setAllAgents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopAgents() {
      try {
        const agentsRes = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
        );
        const agentsMap = agentsRes.data.data.reduce((map, agent) => {
          map[agent.uuid] = agent;
          return map;
        }, {});
        setAllAgents(agentsMap);

        const topRes = await api.get("/api/favorites/top/");
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
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <div className="val-container">
      <header className="val-header">
        <h1>Top Favorited Agents</h1>
        <div>
          <button onClick={handleLogout} className="val-button">
            Logout
          </button>
          <Link to="/home" className="val-button val-button-secondary">
            Back to Home
          </Link>
        </div>
      </header>

      {loading ? (
        <Loading />
      ) : (
        <div className="val-grid" style={{marginTop: "30px"}}>
          {topAgents.length > 0 ? (
            topAgents.map((agent, index) => {
              const agentData = allAgents[agent.agent_uuid];
              return agentData ? (
                <div key={agent.agent_uuid} className="val-card">
                  <Link 
                    to={`/agent/${agent.agent_uuid}`} 
                    state={{ from: '/top-agents' }}
                    className="val-card-link"
                  >
                    <h2 style={{ color: "var(--valorant-red)" }}>#{index + 1}</h2>
                    <div className="val-card-image-container">
                      <img
                        src={agentData.displayIcon}
                        alt={agentData.displayName}
                        className="val-card-image"
                      />
                    </div>
                    <h3>{agentData.displayName}</h3>
                  </Link>
                  <p className="val-card-leaderboard-count">{agent.count} Favorites</p>
                </div>
              ) : null;
            })
          ) : (
            <p>No agents have been favorited yet!</p>
          )}
        </div>
      )}
    </div>
  );
}