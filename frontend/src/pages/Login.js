import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/jwt/create/", {
        username: username,
        password: password,
      });

      if (res.data.access) {
        localStorage.setItem("token", res.data.access);
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
      setLoading(false);
    }
  };

  return (
    <div className="val-auth-container">
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit} className="val-auth-form">
          <h2>Login</h2>
          
          {error && <p style={{ color: "#ff4655" }}>{error}</p>}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="val-search-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="val-search-input"
          />
          <button
            type="submit"
            className="val-button"
          >
            Login
          </button>

          <p>
            No account?{" "}
            <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/" className="secondary-link">
              Return to Home
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}