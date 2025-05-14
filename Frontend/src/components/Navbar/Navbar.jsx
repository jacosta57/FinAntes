import { useData } from 'DataContext';
import { NavLink, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  let navbarLinks;
  const { userProfile } = useData();
  const userStatus = userProfile?.userStatus;
  

  switch (location.pathname) {
    case '/dashboard':
      navbarLinks = (
        <>
          <span id="UserStatus" className="badge-lg rounded-pill me-4 px-3 py-1 border border-white text-white">{userStatus}</span>
          <NavLink to="/editor"><button className="btn btn-outline-light mx-2">Edit Data</button></NavLink>
          <NavLink to="/settings"><button className="btn btn-outline-light">Settings</button></NavLink>
        </>
      )
      break;
    case '/settings':
      navbarLinks = (
        <>
          <span id="UserStatus" className="badge-lg rounded-pill me-4 px-3 py-1 border border-white text-white">{userStatus}</span>
          <NavLink to="/editor"><button className="btn btn-outline-light mx-2">Edit Data</button></NavLink>
          <NavLink to="/dashboard"><button className="btn btn-outline-light">Back to Dashboard</button></NavLink>
        </>
      )
      break;
    case '/editor':
      navbarLinks = (
        <>
          <span id="UserStatus" className="badge-lg rounded-pill me-4 px-3 py-1 border border-white text-white">{userStatus}</span>
          <NavLink to="/dashboard"><button className="btn btn-outline-light mx-2">Back to Dashboard</button></NavLink>
          <NavLink to="/settings"><button className="btn btn-outline-light">Settings</button></NavLink>
        </>
      )
      break;
    case '/demo':
      navbarLinks = (
        <>
          <span id="UserStatus" className="badge-lg rounded-pill me-4 px-3 py-1 border border-white text-white">Demo</span>
          <NavLink to="/auth?tab=login"><button className="btn btn-outline-light mx-2">Login</button></NavLink>
          <NavLink to="/auth?tab=register"><button className="btn btn-outline-light">Signup</button></NavLink>
        </>
      )
      break;
    default:
      navbarLinks = (
        <>
          <NavLink to="/auth?tab=login"><button className="btn btn-outline-light mx-2">Login</button></NavLink>
          <NavLink to="/auth?tab=register"><button className="btn btn-outline-light">Signup</button></NavLink>
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