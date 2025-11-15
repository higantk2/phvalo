import { useState } from "react";
import axios from "axios"; // Use axios directly for this public page
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      // Use the correct local djoser URL for getting the token
      const res = await axios.post("http://127.0.0.1:8000/auth/jwt/create/", {
        username: username,
        password: password,
      });

      if (res.data.access) {
        localStorage.setItem("token", res.data.access);
        // Store refresh token if you plan to use it later
        if (res.data.refresh) {
          localStorage.setItem("refresh", res.data.refresh);
        }
        navigate("/home");
      }
    } catch (err) {
      if (err.response) {
        console.error("Login Error:", err.response.data);
        setError("Invalid username or password.");
      } else {
        setError("Login failed. Please try again.");
        console.error(err);
      }
    }
  };

  // --- Styles (Kept your existing styles) ---
  const buttonStyle = {
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "10px 0",
    width: "100%",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const buttonHover = {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #e63946",
  };
  
  const errorStyle = {
    color: "#ff4655",
    marginTop: "10px"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://images2.alphacoders.com/135/thumb-1920-1356617.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: "40px",
          borderRadius: "12px",
          color: "white",
          width: "320px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Login</h2>
        
        {error && <p style={errorStyle}>{error}</p>}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "none",
            boxSizing: "border-box" 
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "none",
            boxSizing: "border-box"
          }}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, buttonHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, buttonStyle)
          }
        >
          Login
        </button>

        <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#e63946", fontWeight: "bold" }}>
            Register
          </Link>
        </p>
        <p style={{ marginTop: "5px" }}>
          <Link to="/" style={{ color: "#f1faee" }}>
            Return to Home
          </Link>
        </p>
      </form>
    </div>
  );
}