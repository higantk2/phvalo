import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";
import Loading from "../components/Loading"; // <-- Import Loading

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [allAgents, setAllAgents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const agentsRes = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
        );
        const agentsMap = agentsRes.data.data.reduce((map, agent) => {
          map[agent.uuid] = agent;
          return map;
        }, {});
        setAllAgents(agentsMap);

        const favoritesRes = await api.get("/api/favorites/");
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  const removeFavorite = async (favId) => {
    try {
      await api.delete(`/api/favorites/${favId}/`);
      setFavorites(favorites.filter((fav) => fav.id !== favId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  return (
    <div className="val-container">
      <header className="val-header">
        <h1>My Favorite Agents</h1>
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
          {favorites.length > 0 ? (
            favorites.map((fav) => {
              const agentData = allAgents[fav.agent_uuid];
              return agentData ? (
                <div key={fav.id} className="val-card">
                  <Link 
                    to={`/agent/${fav.agent_uuid}`} 
                    state={{ from: '/favorites' }}
                    className="val-card-link"
                  >
                    <div className="val-card-image-container">
                      <img
                        src={agentData.displayIcon}
                        alt={agentData.displayName}
                        className="val-card-image"
                      />
                    </div>
                    <h3>{agentData.displayName}</h3>
                  </Link>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="val-button-fav remove"
                  >
                    Remove
                  </button>
                </div>
              ) : null;
            })
          ) : (
            <p>You haven't favorited any agents yet!</p>
          )}
        </div>
      )}
    </div>
  );
}