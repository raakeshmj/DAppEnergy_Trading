import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Adjust if your path differs
import logo from '../public/images/Logo1.png'; // Adjust if your path differs

const Navbar = ({ account }) => {
  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  return (
    <nav className="neon-navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="DegenWatts Logo" className="navbar-logo-glow" />
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create-listing">Sell Energy</Link>
        <Link to="/view-listings">Buy Energy</Link>
      </div>

      <div className="navbar-right">
        {account ? (
          <div className="wallet-connected">
            <span className="wallet-status-glow" />
            {shortAddress}
          </div>
        ) : (
          <button className="connect-wallet-btn">Connect Wallet</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
