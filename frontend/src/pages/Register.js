import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // <-- CHANGED

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // --- CHANGED ---
      // Used 'api' and the relative URL
      const response = await api.post("/api/users/register/", {
        username,
        password,
      });

      console.log("✅ Success:", response.data);
      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500); // redirect after success
    } catch (error) {
      if (error.response) {
        console.error("❌ Error response:", error.response.data);
        // A more user-friendly error
        const errorData = error.response.data;
        if (errorData.username) {
          setMessage(`❌ Registration failed: ${errorData.username[0]}`);
        } else {
          setMessage(`❌ Registration failed: ${JSON.stringify(errorData)}`);
        }
      } else if (error.request) {
        console.error("❌ No response:", error.request);
        setMessage("❌ No response from server. Is the backend deployed and running?");
      } else {
        console.error("❌ Error:", error.message);
        setMessage("❌ Error: " + error.message);
      }
    }
  };

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
        onSubmit={handleRegister}
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

        {message && (
          <p style={{ marginTop: "10px", color: message.includes("✅") ? "#06d6a0" : "#ff4655" }}>
            {message}
          </p>
        )}

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