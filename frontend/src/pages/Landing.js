import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      className="val-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        backgroundImage:
          "url('https://images2.alphacoders.com/135/1356853.jpeg')",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Valorant Agent Tracker
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "40px" }}>
        Keep track of your favorite Valorant agents and weapons!
      </p>

      <div>
        <Link to="/login">
          <button className="val-button">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="val-button">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}