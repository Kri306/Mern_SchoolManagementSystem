import React from 'react';
import * as Icons from './Icons';

function TopNavbar({ searchTerm, setSearchTerm, onLogout }) {
  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button className="hamburger-btn">
          <Icons.Hamburger />
        </button>
        <div className="top-search-box">4
          <span className="top-search-icon"><Icons.Search /></span>
          <input
            type="text"
            className="top-search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="top-navbar-right">
        <button className="nav-action-btn"><Icons.Bell /></button>
        {/* <button className="nav-action-btn"><Icons.Grid /></button>
        <button className="nav-action-btn"><Icons.Folder /></button>
        <button className="nav-action-btn"><Icons.Cart /></button> */}
        <button className="nav-action-btn"><Icons.Message /></button>
        <button className="nav-action-btn">
          <img src="https://flagcdn.com/w40/in.png" alt="US Flag" className="flag-icon" />
        </button>
        {/* <button className="nav-action-btn"><Icons.Expand /></button> */}
        <a href="#" className="btn-reports" onClick={(e) => { e.preventDefault(); onLogout(); }}>Sign Out</a>
      </div>
    </header>
  );
}

export default TopNavbar;
