import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [allAgents, setAllAgents] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchFavorites() {
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

        // 2. Fetch user's favorites
        const favoritesRes = await axios.get("http://127.0.0.1:8000/api/favorites/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchFavorites();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const removeFavorite = async (favId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/favorites/${favId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update state to remove the favorite
      setFavorites(favorites.filter((fav) => fav.id !== favId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
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
    return <div style={containerStyle}>Loading Favorites...</div>;
  }

  return (
    <div style={containerStyle}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <h1>My Favorite Agents</h1>
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
        {favorites.length > 0 ? (
          favorites.map((fav) => {
            const agentData = allAgents[fav.agent_uuid];
            return agentData ? (
              <div key={fav.id} style={cardStyle}>
                <Link to={`/agent/${fav.agent_uuid}`} state={{ from: '/favorites' }}>
                  <img
                    src={agentData.displayIcon}
                    alt={agentData.displayName}
                    width="100"
                    height="100"
                    style={{ borderRadius: "5px" }}
                  />
                  <p style={{ fontWeight: "bold", color: "white", textDecoration: "none" }}>{agentData.displayName}</p>
                </Link>
                <button
                  onClick={() => removeFavorite(fav.id)}
                  style={{
                    backgroundColor: "#f1faee",
                    color: "#e63946",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              // Fallback in case agent data isn't found
              <div key={fav.id} style={cardStyle}>
                <p>{fav.agent_name} (Data not found)</p>
              </div>
            );
          })
        ) : (
          <p>You haven't favorited any agents yet!</p>
        )}
      </div>
    </div>
  );
}