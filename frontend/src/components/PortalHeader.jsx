import React, { useState } from "react";
import LogoutButton from "./LogoutButton";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const schoolName = localStorage.getItem("schoolName");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("email");
    const userRole = localStorage.getItem("role");

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="portal-header">
        <h3 className="title">Course Portal</h3>

        <div className="user-section">
            <button onClick={toggleMenu} className="user-inner">
                <img className="user-icon" src="/default-user.png" alt="User Icon"/>
                <p className="username font-medium">
                    {userName ? userName : "Welcome"}
                </p>
            </button>

            {menuOpen && (
            <div className="nav-menu-dropdown">
                <div className="dropdown-top">
                    {/* <p className="user-name">{userName}</p> */}
                    <p className="user-email">{userEmail}</p>
                    <p className="user-role">
                        Role: {userRole}
                    </p>
                    {schoolName && (
                        <p className="school-name">
                        School: {schoolName}
                        </p>
                    )}
                </div>
                <LogoutButton />
            </div>
            )}
        </div>
        </header>
    );
};

export default Header;
