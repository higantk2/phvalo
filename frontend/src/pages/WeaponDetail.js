import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function WeaponDetail() {
  const { weaponUuid } = useParams();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Determine where to link "Back" to
  const from = location.state?.from || '/weapons';

  useEffect(() => {
    async function fetchWeaponDetail() {
      try {
        const url = `https://valorant-api.com/v1/weapons/${weaponUuid}`;
        const res = await axios.get(url);
        setWeapon(res.data.data); 
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch weapon details:", err);
        setError("Failed to load weapon details. Please try again.");
        setLoading(false);
      }
    }
    fetchWeaponDetail();
  }, [weaponUuid]);

  // --- Styles ---
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "white",
    padding: "40px",
    backgroundImage: "url('https://images4.alphacoders.com/126/thumb-1920-1264065.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
  
  const contentStyle = {
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #06d6a0",
    maxWidth: "800px",
    margin: "20px auto"
  };

  const skinCardStyle = {
    margin: "10px",
    border: "2px solid #06d6a0",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    width: "200px",
    backgroundColor: "#1a1a1a",
    color: "white",
  };
  // ----------------

  if (loading) {
    return <div style={containerStyle}>Loading weapon details...</div>;
  }

  if (error || !weapon) {
    return <div style={{...containerStyle, color: "red" }}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <Link to={from} style={{ color: "#06d6a0", fontWeight: "bold", textDecoration: "none" }}>
        &lt; Back
      </Link>
      
      <div style={contentStyle}>
        <h1 style={{ marginTop: "20px", color: "#06d6a0" }}>{weapon.displayName}</h1>
        <p style={{ fontStyle: "italic", color: "#aaa" }}>{weapon.category ? weapon.category.replace('EEquippableCategory::', '') : 'Weapon'}</p>
        
        <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "30px", flexWrap: "wrap" }}>
          
          <img
            src={weapon.displayIcon}
            alt={weapon.displayName}
            style={{ 
                width: "400px", 
                height: "auto", 
                borderRadius: "8px", 
                filter: 'invert(1)', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                padding: '20px' 
              }}
          />
          
          {weapon.weaponStats && (
              <div>
                  <h2>Weapon Stats</h2>
                  <p><strong>Fire Rate:</strong> {weapon.weaponStats.fireRate} rds/sec</p>
                  <p><strong>Magazine Size:</strong> {weapon.weaponStats.magazineSize}</p>
                  <p><strong>Reload Time:</strong> {weapon.weaponStats.reloadTimeSeconds} sec</p>
                  <p><strong>Equip Time:</strong> {weapon.weaponStats.equipTimeSeconds} sec</p>
                  
                  <h3 style={{marginTop: '20px'}}>Damage</h3>
                  {weapon.weaponStats.damageRanges.map((range, index) => (
                      <div key={index} style={{borderTop: '1px solid #333', paddingTop: '10px', marginTop: '10px'}}>
                          <p><strong>Range:</strong> {range.rangeStartMeters}m - {range.rangeEndMeters}m</p>
                          <ul style={{paddingLeft: '20px'}}>
                              <li>Head: <span style={{color: '#ff4655'}}>{range.headDamage}</span></li>
                              <li>Body: {range.bodyDamage}</li>
                              <li>Leg: {range.legDamage}</li>
                          </ul>
                      </div>
                  ))}
              </div>
          )}
        </div>

        <h2 style={{marginTop: '40px', borderTop: '1px solid #06d6a0', paddingTop: '20px'}}>Skins</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {weapon.skins.map(skin => {
                if (!skin.displayIcon || skin.displayName.includes('Standard')) {
                    return null; // Skip default or skins without images
                }
                return (
                    <div key={skin.uuid} style={skinCardStyle}>
                        <img 
                            src={skin.displayIcon} 
                            alt={skin.displayName}
                            style={{width: '100%', height: '80px', objectFit: 'contain', marginBottom: '10px'}}
                        />
                        <p>{skin.displayName}</p>
                    </div>
                )
            })}
        </div>

      </div>
    </div>
  );
}