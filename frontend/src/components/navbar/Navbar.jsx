// src/components/navbar/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBook, FaPalette, FaMagic, FaDollarSign } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/demo", icon: FaMagic, label: "Demo" },
    { path: "/gallery", icon: FaPalette, label: "Gallery" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaBook className="logo-icon" />
          <span>StoryBloom AI</span>
        </Link>

        <div className="navbar-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon className="link-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="navbar-actions">
          <Link to="/pricing" className="navbar-btn">
            <FaDollarSign className="btn-icon" />
            <span>Pricing</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;