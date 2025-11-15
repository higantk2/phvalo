import { useEffect, useState } from "react";
import axios from "axios"; // Keep for external API
import { Link } from "react-router-dom";
import api from "../api"; // Use this for your backend

export default function Weapons() {
  const [allWeapons, setAllWeapons] = useState([]); 
  const [filteredWeapons, setFilteredWeapons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllData = async () => {
        try {
            // External API call uses 'axios'
            const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
            const playableWeapons = weaponsRes.data.data.filter(w => w.shopData || w.displayName === 'Melee');
            setAllWeapons(playableWeapons);
            setFilteredWeapons(playableWeapons); 

            if (token) {
              // Your backend call now uses 'api' and has no headers
              const favoritesRes = await api.get("/api/favorites/weapons/");
              setFavorites(favoritesRes.data);
            }
        } catch (error) {
            console.error("Error fetching weapon data:", error);
        } finally {
            setLoading(false);
        }
    }
    
    fetchAllData();
  }, [token]);

  useEffect(() => {
    let tempWeapons = [...allWeapons];
    if (searchTerm) {
      tempWeapons = tempWeapons.filter((weapon) =>
        weapon.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredWeapons(tempWeapons);
  }, [searchTerm, allWeapons]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  const toggleFavorite = async (e, weapon) => {
    e.preventDefault();
    e.stopPropagation();

    const exists = favorites.find((f) => f.weapon_uuid === weapon.uuid);
    
    try {
      if (exists) {
        // No headers needed
        await api.delete(`/api/favorites/weapons/${exists.id}/`);
        setFavorites(favorites.filter((f) => f.weapon_uuid !== weapon.uuid));
      } else {
        // No headers needed
        const res = await api.post(
          "/api/favorites/weapons/",
          { weapon_uuid: weapon.uuid, weapon_name: weapon.displayName }
        );
        setFavorites([...favorites, res.data]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite weapon:", err);
    }
  };

  if (loading) {
      return (
        <div className="val-container">
            <h1>Loading weapons...</h1>
        </div>
      );
  }

  return (
    <div className="val-container">
      <header className="val-header">
        <h1 style={{color: '#06d6a0'}}>Valorant Weapons</h1>
        <div className="val-header-nav">
          <button onClick={handleLogout} className="val-button">
            Logout
          </button>
          <Link to="/home" className="val-button">
            Back to Home
          </Link>
          <Link to="/top-weapons" className="val-button val-button-green">
            Top Weapons
          </Link>
        </div>
      </header>
      
      <div className="val-filter-container">
        <input
          type="text"
          placeholder="Search weapons..."
          className="val-search-input val-search-input-green"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2>All Weapons</h2>
      <div className="val-grid">
        {filteredWeapons.length > 0 ? (
          filteredWeapons.map((weapon) => {
            if (!weapon.displayIcon) return null;
            const isFav = favorites.some((f) => f.weapon_uuid === weapon.uuid);
            
            return (
              <Link
                key={weapon.uuid}
                to={`/weapon/${weapon.uuid}`}
                state={{ from: '/weapons' }}
                className="val-card val-card-green"
              >
                <div>
                  <div className="val-card-image-container" style={{height: '80px'}}>
                    <img
                      src={weapon.displayIcon}
                      alt={weapon.displayName}
                      className="val-card-weapon-image"
                    />
                  </div>
                  <h3>{weapon.displayName}</h3>
                </div>

                <button
                  onClick={(e) => toggleFavorite(e, weapon)}
                  className={`val-button-fav ${isFav ? "remove-green" : "add-green"}`}
                >
                  {isFav ? "Unfavorite" : "Favorite"}
                </button>
              </Link>
            );
          })
        ) : (
          <p>No weapons match your criteria.</p>
        )}
      </div>
    </div>
  );
}