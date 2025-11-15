import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";
import Loading from "../components/Loading"; // <-- Import Loading

export default function TopWeapons() {
  const [topWeapons, setTopWeapons] = useState([]);
  const [allWeapons, setAllWeapons] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopWeapons() {
      try {
        const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
        const weaponsMap = weaponsRes.data.data.reduce((map, weapon) => {
          map[weapon.uuid] = weapon;
          return map;
        }, {});
        setAllWeapons(weaponsMap);

        const topRes = await api.get("/api/favorites/top/weapons/");
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
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <div className="val-container">
      <header className="val-header" style={{borderColor: 'var(--valorant-secondary)'}}>
        <h1 style={{color: 'var(--valorant-secondary)'}}>Top Favorited Weapons</h1>
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
          {topWeapons.length > 0 ? (
            topWeapons.map((weapon, index) => {
              const weaponData = allWeapons[weapon.weapon_uuid];
              return weaponData ? (
                <div key={weapon.weapon_uuid} className="val-card" style={{borderColor: 'var(--valorant-secondary)'}}>
                  <Link 
                    to={`/weapon/${weapon.weapon_uuid}`} 
                    state={{ from: '/top-weapons' }}
                    className="val-card-link"
                  >
                    <h2 style={{ color: "var(--valorant-secondary)" }}>#{index + 1}</h2>
                    <div className="val-card-image-container" style={{height: '80px'}}>
                      <img
                        src={weaponData.displayIcon}
                        alt={weaponData.displayName}
                        className="val-card-weapon-image"
                      />
                    </div>
                    <h3>{weaponData.displayName}</h3>
                  </Link>
                  <p className="val-card-leaderboard-count" style={{color: 'var(--valorant-secondary)'}}>{weapon.count} Favorites</p>
                </div>
              ) : null;
            })
          ) : (
            <p>No weapons have been favorited yet!</p>
          )}
        </div>
      )}
    </div>
  );
}