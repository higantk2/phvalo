import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TopWeapons() {
  const [topWeapons, setTopWeapons] = useState([]);
  const [allWeapons, setAllWeapons] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTopWeapons() {
      try {
        // 1. Fetch all weapon data for images
        const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
        const weaponsMap = weaponsRes.data.data.reduce((map, weapon) => {
          map[weapon.uuid] = weapon;
          return map;
        }, {});
        setAllWeapons(weaponsMap);

        // 2. Fetch top favorited weapons
        const topRes = await axios.get("http://127.0.0.1:8000/api/favorites/top/weapons/");
        setTopWeapons(topRes.data);
      } catch (err) {
        console.error("Failed to load top weapons", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopWeapons();
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
    return <div style={containerStyle}>Loading Top Weapons...</div>;
  }

  return (
    <div style={containerStyle}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <h1>Top Favorited Weapons</h1>
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
        {topWeapons.length > 0 ? (
          topWeapons.map((weapon, index) => {
            const weaponData = allWeapons[weapon.weapon_uuid];
            return weaponData ? (
              <div key={weapon.weapon_uuid} style={cardStyle}>
                <h2 style={{ color: "#06d6a0" }}>#{index + 1}</h2>
                <Link to={`/weapon/${weapon.weapon_uuid}`} state={{ from: '/top-weapons' }}>
                  <img
                    src={weaponData.displayIcon}
                    alt={weaponData.displayName}
                    style={{ borderRadius: "5px", filter: 'invert(1)', height: '50px', padding: '10px' }}
                  />
                  <p style={{ fontWeight: "bold", color: "white", textDecoration: "none" }}>{weaponData.displayName}</p>
                </Link>
                <p style={{ color: "#06d6a0", fontWeight: "bold" }}>{weapon.count} Favorites</p>
              </div>
            ) : null;
          })
        ) : (
          <p>No weapons have been favorited yet!</p>
        )}
      </div>
    </div>
  );
}