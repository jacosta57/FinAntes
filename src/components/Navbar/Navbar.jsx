import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';

function Navbar() {

  const location = useLocation();
  let navbarLinks;
  const userStatus = localStorage.getItem('userStatus') || 'basic';

  switch (location.pathname) {
    case '/dashboard':
      navbarLinks = (
        <>
          <span id="UserStatus" class="badge-lg rounded-pill me-4 px-3 py-1 border border-white text-white">{userStatus}</span>
          <NavLink to="./finances.html"><button id="FinancesButton" class="btn btn-outline-light mx-2">Edit Data</button></NavLink>
          <NavLink to="./settings.html"><button id="SettingsButton" class="btn btn-outline-light">Settings</button></NavLink>
        </>
      )
      break;
    default:
      navbarLinks = (
        <>
          <NavLink to="/dashboard"><button id="LoginButton" className="btn btn-outline-light mx-2">Login</button></NavLink>
          <NavLink to="/settings"><button id="SignupButton" className="btn btn-outline-light">Signup</button></NavLink>
        </>
      )
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <NavLink className="navbar-brand text-white" to="/">
          <span className="me-2">●●</span> FinAntes
        </NavLink>
        <span className="navbar-text text-white me-auto">Your Finances, One Step Ahead</span>
          {navbarLinks}
        <br />
      </div>
    </nav>
  )
}

export default Navbar