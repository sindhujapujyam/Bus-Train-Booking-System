
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span>✈</span> TravelGo
      </Link>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/bookings">My Bookings</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
