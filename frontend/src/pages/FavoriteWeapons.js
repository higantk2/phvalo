import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";
import Loading from "../components/Loading"; // <-- Import Loading

export default function FavoriteWeapons() {
  const [favorites, setFavorites] = useState([]);
  const [allWeapons, setAllWeapons] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
        const weaponsMap = weaponsRes.data.data.reduce((map, weapon) => {
          map[weapon.uuid] = weapon;
          return map;
        }, {});
        setAllWeapons(weaponsMap);

        const favoritesRes = await api.get("/api/favorites/weapons/");
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Failed to load favorite weapons", err);
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
      await api.delete(`/api/favorites/weapons/${favId}/`);
      setFavorites(favorites.filter((fav) => fav.id !== favId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  return (
    <div className="val-container">
      <header className="val-header" style={{borderColor: 'var(--valorant-secondary)'}}>
        <h1 style={{color: 'var(--valorant-secondary)'}}>My Favorite Weapons</h1>
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
              const weaponData = allWeapons[fav.weapon_uuid];
              return weaponData ? (
                <div key={fav.id} className="val-card" style={{borderColor: 'var(--valorant-secondary)'}}>
                  <Link 
                    to={`/weapon/${fav.weapon_uuid}`} 
                    state={{ from: '/favorite-weapons' }}
                    className="val-card-link"
                  >
                    <div className="val-card-image-container" style={{height: '80px'}}>
                      <img
                        src={weaponData.displayIcon}
                        alt={weaponData.displayName}
                        className="val-card-weapon-image"
                      />
                    </div>
                    <h3>{weaponData.displayName}</h3>
                  </Link>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="val-button-fav remove-green"
                    style={{
                      backgroundColor: '#f1faee',
                      color: 'var(--valorant-secondary)'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : null;
            })
          ) : (
            <p>You haven't favorited any weapons yet!</p>
          )}
        </div>
      )}
    </div>
  );
}