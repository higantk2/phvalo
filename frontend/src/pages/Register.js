import { useState } from "react";
import axios from "axios"; // Use axios directly for this public page
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      // Use the correct local djoser URL
      await axios.post("http://127.0.0.1:8000/auth/users/", {
        username: username,
        password: password,
      });
      // On success, redirect to the login page
      navigate("/login");
    } catch (err) {
      if (err.response) {
        console.error("Registration Error:", err.response.data);
        let errorMsg = "Registration failed. ";
        const errorData = err.response.data;
        if (errorData.username) {
          errorMsg += `Username: ${errorData.username.join(" ")} `;
        }
        if (errorData.password) {
          errorMsg += `Password: ${errorData.password.join(" ")} `;
        }
        setError(errorMsg);
      } else {
        setError("Registration failed. Please try again.");
        console.error(err);
      }
    }
  };

  // --- Styles (Kept your existing styles) ---
  const buttonStyle = {
    backgroundColor: "#ff4655",
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
    boxShadow: "0px 0px 15px #ff4655",
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
          "url('https://images8.alphacoders.com/135/1356821.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "40px",
          borderRadius: "12px",
          color: "white",
          width: "340px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(255,70,85,0.8)",
          border: "2px solid #ff4655",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#ff4655" }}>Register</h2>

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
            border: "1px solid #ff4655",
            background: "#1a1a1d",
            color: "white",
            boxSizing: "border-box" // Added for better padding
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
            border: "1px solid #ff4655",
            background: "#1a1a1d",
            color: "white",
            boxSizing: "border-box" // Added for better padding
          }}
        />

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        >
          Register
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#ff4655", fontWeight: "bold" }}>
            Login
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