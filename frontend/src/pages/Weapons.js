import { useEffect, useState } from "react";
import axios from "axios"; // Keep for valorant-api
import api from "../api"; // <-- IMPORT THIS
import { Link } from "react-router-dom"; 

export default function Weapons() {
  const [allWeapons, setAllWeapons] = useState([]); 
  const [filteredWeapons, setFilteredWeapons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); 
  // const token = localStorage.getItem("token"); // No longer needed here

  useEffect(() => {
    const fetchAllData = async () => {
        try {
            // This is external, so 'axios' is fine
            const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
            const playableWeapons = weaponsRes.data.data.filter(w => w.shopData || w.displayName === 'Melee');
            setAllWeapons(playableWeapons);
            setFilteredWeapons(playableWeapons); 

            // This is your backend, use 'api'
            const favoritesRes = await api.get("/api/favorites/weapons/");
            setFavorites(favoritesRes.data);
        } catch (error) {
            console.error("Error fetching weapon data:", error);
        } finally {
            setLoading(false);
        }
    }
    
    fetchAllData();
  }, []); // token dependency removed

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
    localStorage.removeItem("refresh"); // Also remove refresh token
    window.location.href = "/";
  };

  const toggleFavorite = async (e, weapon) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    const exists = favorites.find((f) => f.weapon_uuid === weapon.uuid);
    
    if (exists) {
      // Use 'api' and relative URL
      await api.delete(`/api/favorites/weapons/${exists.id}/`);
      setFavorites(favorites.filter((f) => f.weapon_uuid !== weapon.uuid));
    } else {
      // Use 'api' and relative URL
      const res = await api.post("/api/favorites/weapons/", { 
          weapon_uuid: weapon.uuid, 
          weapon_name: weapon.displayName 
      });
      setFavorites([...favorites, res.data]);
    }
  };

  // --- Styles (Your styles are unchanged) ---
  const cardStyle = {
    margin: "10px",
    border: "2px solid #06d6a0",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    width: "140px",
    backgroundColor: "#1a1a1a",
    color: "white",
    transition: "transform 0.2s, box-shadow 0.2s",
    textDecoration: 'none' 
  };
  const cardHover = {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #06d6a0",
  };
  const searchInputStyle = {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    borderRadius: "5px",
    border: "2px solid #06d6a0",
    background: "#1a1a1d",
    color: "white",
    fontSize: "16px",
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
  const greenButtonStyle = {
      ...navButtonStyle,
      backgroundColor: "#06d6a0",
  };

  if (loading) {
      return (
        <div style={{minHeight: "100vh", backgroundColor: "#0d0d0d", color: "white", padding: "20px"}}>
            Loading weapons...
        </div>
      );
  }

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
        <h1 style={{marginRight: '20px'}}>Valorant Weapons</h1>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
          <button onClick={handleLogout} style={navButtonStyle}>
            Logout
          </button>
                    
          <Link to="/home" style={navButtonStyle}>
            Back to Home
          </Link>
          
          <Link to="/top-weapons" style={greenButtonStyle}>
            Top Weapons
          </Link>

        </div>
      </header>
      
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search weapons..."
          style={searchInputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 style={{ marginTop: "20px" }}>All Weapons</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        
        {filteredWeapons.length > 0 ? (
          filteredWeapons.map((weapon) => {
            if (!weapon.displayIcon) return null; 
            const isFav = favorites.some((f) => f.weapon_uuid === weapon.uuid);
            
            return (
              <Link
                key={weapon.uuid}
                to={`/weapon/${weapon.uuid}`}
                state={{ from: '/weapons' }}
                style={cardStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, cardHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, cardStyle)
                }
              >
                  <img
                    src={weapon.displayIcon}
                    alt={weapon.displayName}
                    style={{ borderRadius: "5px", filter: 'invert(1)', height: '50px', padding: '10px' }}
                  />
                  <p style={{ fontWeight: "bold" }}>{weapon.displayName}</p>

                <button
                  onClick={(e) => toggleFavorite(e, weapon)} 
                  style={{
                    backgroundColor: isFav ? "#f1faee" : "#06d6a0",
                    color: isFav ? "#06d6a0" : "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    zIndex: 2 
                  }}
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