import React from 'react';
import './Navbar.css'; // Import CSS file for styling
import userProfileIcon from './profile.png';
function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        {/* <h1 className="navbar-logo"> */}
        <h2 href="/" className="nav-link">Streamer</h2>
        
        {/* </h1> */}
        <ul className="nav-menu">
        <li className="nav-item">
            <img src={userProfileIcon} alt="User Profile" className="user-profile-icon" />
          </li>

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
