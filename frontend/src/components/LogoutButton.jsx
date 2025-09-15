import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/student/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="base-btn logout-button"
    >
        Logout
    </button>
  );
};

export default LogoutButton;
