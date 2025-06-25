import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // Optional: create your own styles here

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        💰 Budget Tracker
      </div>
      <div className="navbar-right">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
