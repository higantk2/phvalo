import { useEffect, useState } from "react";
import axios from "axios"; // Keep for valorant-api
import api from "../api"; // <-- IMPORT THIS
import { Link } from "react-router-dom";

export default function FavoriteWeapons() {
  const [favorites, setFavorites] = useState([]);
  const [allWeapons, setAllWeapons] = useState({});
  const [loading, setLoading] = useState(true);
  // const token = localStorage.getItem("token"); // No longer needed here

  useEffect(() => {
    async function fetchFavorites() {
      try {
        // 1. Fetch all weapon data for images (external)
        const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
        const weaponsMap = weaponsRes.data.data.reduce((map, weapon) => {
          map[weapon.uuid] = weapon;
          return map;
        }, {});
        setAllWeapons(weaponsMap);

        // 2. Fetch user's favorite weapons (backend)
        const favoritesRes = await api.get("/api/favorites/weapons/");
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Failed to load favorite weapons", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []); // token dependency removed

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh"); // Also remove refresh token
    window.location.href = "/";
  };

  const removeFavorite = async (favId) => {
    try {
      // Use 'api' and relative URL
      await api.delete(`/api/favorites/weapons/${favId}/`);
      setFavorites(favorites.filter((fav) => fav.id !== favId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  // --- Styles (Your styles are unchanged) ---
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
    border: "2px solid #06d6a0",
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
    return <div style={containerStyle}>Loading Favorite Weapons...</div>;
  }

  return (
    <div style={containerStyle}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <h1>My Favorite Weapons</h1>
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
            const weaponData = allWeapons[fav.weapon_uuid];
            return weaponData ? (
              <div key={fav.id} style={cardStyle}>
                <Link to={`/weapon/${fav.weapon_uuid}`} state={{ from: '/favorite-weapons' }}>
                  <img
                    src={weaponData.displayIcon}
                    alt={weaponData.displayName}
                    style={{ borderRadius: "5px", filter: 'invert(1)', height: '50px', padding: '10px' }}
                  />
                  <p style={{ fontWeight: "bold", color: "white", textDecoration: "none" }}>{weaponData.displayName}</p>
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
              <div key={fav.id} style={cardStyle}>
                <p>{fav.weapon_name} (Data not found)</p>
              </div>
            );
          })
        ) : (
          <p>You haven't favorited any weapons yet!</p>
        )}
      </div>
    </div>
  );
}