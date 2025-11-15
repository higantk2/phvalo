import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";
import Loading from "../components/Loading"; // <-- Import Loading

export default function Weapons() {
  const [allWeapons, setAllWeapons] = useState([]); 
  const [filteredWeapons, setFilteredWeapons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAllData = async () => {
        try {
            const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
            const playableWeapons = weaponsRes.data.data.filter(w => w.shopData || w.displayName === 'Melee');
            setAllWeapons(playableWeapons);
            setFilteredWeapons(playableWeapons); 

            const favoritesRes = await api.get("/api/favorites/weapons/");
            setFavorites(favoritesRes.data);
        } catch (error) {
            console.error("Error fetching weapon data:", error);
        } finally {
            setLoading(false);
        }
    }
    
    fetchAllData();
  }, []);

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

  const toggleFavorite = async (weapon) => {
    // Event stop propagation is no longer needed
    const exists = favorites.find((f) => f.weapon_uuid === weapon.uuid);
    
    if (exists) {
      await api.delete(`/api/favorites/weapons/${exists.id}/`);
      setFavorites(favorites.filter((f) => f.weapon_uuid !== weapon.uuid));
    } else {
      const res = await api.post("/api/favorites/weapons/", { 
          weapon_uuid: weapon.uuid, 
          weapon_name: weapon.displayName 
      });
      setFavorites([...favorites, res.data]);
    }
  };

  return (
    <div className="val-container">
      {/* --- WEAPON THEME HEADER --- */}
      <header className="val-header" style={{borderColor: 'var(--valorant-secondary)'}}>
        <h1 style={{color: 'var(--valorant-secondary)'}}>Valorant Weapons</h1>
        <div className="val-header-nav">
          <button onClick={handleLogout} className="val-button">
            Logout
          </button>
                    
          <Link to="/home" className="val-button val-button-secondary">
            Back to Home
          </Link>
          
          <Link to="/top-weapons" className="val-button val-button-secondary">
            Top Weapons
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
              placeholder="Search weapons..."
              className="val-search-input"
              style={{borderColor: 'var(--valorant-secondary)'}}
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
                  // --- CARD FIX: The Link and Button are now separate ---
                  <div key={weapon.uuid} className="val-card val-card-green" style={{borderColor: 'var(--valorant-secondary)'}}>
                    <Link
                      to={`/weapon/${weapon.uuid}`}
                      state={{ from: '/weapons' }}
                      className="val-card-link"
                    >
                      <div className="val-card-image-container" style={{height: '80px'}}>
                        <img
                          src={weapon.displayIcon}
                          alt={weapon.displayName}
                          className="val-card-weapon-image"
                        />
                      </div>
                      <h3>{weapon.displayName}</h3>
                    </Link>

                    <button
                      onClick={() => toggleFavorite(weapon)} 
                      className={`val-button-fav ${isFav ? "remove-green" : "add-green"}`}
                      style={{
                        backgroundColor: isFav ? '#f1faee' : 'var(--valorant-secondary)',
                        color: isFav ? 'var(--valorant-secondary)' : 'white'
                      }}
                    >
                      {isFav ? "Unfavorite" : "Favorite"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p>No weapons match your criteria.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}