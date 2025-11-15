import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";

export default function Register() {
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
      await axios.post("http://127.0.0.1:8000/auth/users/", {
        username: username,
        password: password,
      });
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
      setLoading(false);
    }
  };

  return (
    <div className="val-auth-container">
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit} className="val-auth-form">
          <h2>Register</h2>

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
            Register
          </button>

          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
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