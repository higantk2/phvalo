import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";
import Loading from "../components/Loading"; // <-- Import Loading

const AGENT_ROLES = ["All", "Duelist", "Initiator", "Controller", "Sentinel"];

export default function Home() {
  const [allAgents, setAllAgents] = useState([]); 
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [loading, setLoading] = useState(true); // <-- Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsRes = await axios.get("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
        setAllAgents(agentsRes.data.data);
        setFilteredAgents(agentsRes.data.data); 

        const favoritesRes = await api.get("/api/favorites/");
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // <-- Stop loading
      }
    }
    fetchData();
  }, []);

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
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  const toggleFavorite = async (agent) => {
    const exists = favorites.find((f) => f.agent_uuid === agent.uuid);
    if (exists) {
      await api.delete(`/api/favorites/${exists.id}/`);
      setFavorites(favorites.filter((f) => f.agent_uuid !== agent.uuid));
    } else {
      const res = await api.post("/api/favorites/", { 
        agent_uuid: agent.uuid, 
        agent_name: agent.displayName 
      });
      setFavorites([...favorites, res.data]);
    }
  };

  return (
    <div className="val-container">
      <header className="val-header">
        <h1>Valorant Tracker</h1>
        <div className="val-header-nav">
          <button onClick={handleLogout} className="val-button">
            Logout
          </button>
          <Link to="/top-agents" className="val-button val-button-secondary"> 
            Top Agents
          </Link>
          <Link to="/top-weapons" className="val-button val-button-secondary">
            Top Weapons
          </Link>
          <Link to="/weapons" className="val-button val-button-secondary">
            Weapons
          </Link>
          <Link to="/favorites" className="val-button">
            My Fave Agents
          </Link>
          <Link to="/favorite-weapons" className="val-button">
            My Fave Weapons
          </Link>
        </div>
      </header>
      
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="val-filter-container">
            <input
              type="text"
              placeholder="Search agents..."
              className="val-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="val-role-filter-container">
              {AGENT_ROLES.map(role => (
                <button
                  key={role}
                  className={`val-role-button ${selectedRole === role ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <h2>Agents</h2>
          <div className="val-grid">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => {
                const isFav = favorites.some((f) => f.agent_uuid === agent.uuid);
                return (
                  <div key={agent.uuid} className="val-card">
                    <Link 
                      to={`/agent/${agent.uuid}`} 
                      state={{ from: 'home' }} 
                      className="val-card-link"
                    >
                      <div className="val-card-image-container">
                        <img
                          src={agent.displayIcon}
                          alt={agent.displayName}
                          className="val-card-image"
                        />
                      </div>
                      <h3>{agent.displayName}</h3>
                    </Link>

                    <button
                      onClick={() => toggleFavorite(agent)}
                      className={`val-button-fav ${isFav ? "remove" : "add"}`}
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
        </>
      )}
    </div>
  );
}