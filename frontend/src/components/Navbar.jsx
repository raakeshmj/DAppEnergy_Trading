import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../public/images/Logo1.png';

const Navbar = ({ account }) => {
  const [networkName, setNetworkName] = useState('');
  const [balance, setBalance] = useState('');

  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  const handleWalletClick = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected account:', accounts[0]);
      } catch (err) {
        console.error('MetaMask connection error:', err);
      }
    } else {
      alert('MetaMask not found. Please install MetaMask in the Arc browser extension.');
    }
  };

  const getNetworkAndBalance = async () => {
    if (window.ethereum && account) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        switch (chainId) {
          case '0x1':
            setNetworkName('Ethereum');
            break;
          case '0x89':
            setNetworkName('Polygon');
            break;
          case '0x13881':
            setNetworkName('Mumbai');
            break;
          case '0x539':
          case '0x7a69':
            setNetworkName('Ganache');
            break;
          default:
            setNetworkName(`Chain ${chainId}`);
        }

        const weiBalance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });
        const ethBalance = parseFloat(parseInt(weiBalance, 16) / 1e18).toFixed(3);
        setBalance(`${ethBalance} ETH`);
      } catch (err) {
        console.error('Error fetching network or balance:', err);
      }
    }
  };

  useEffect(() => {
    getNetworkAndBalance();
  }, [account]);

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
          <div className="wallet-connected" onClick={handleWalletClick}>
            <span className="wallet-status-glow" />
            <div className="wallet-info">
              <span className="wallet-full">{account}</span>
              <span className="wallet-short">{shortAddress}</span>
              <div className="wallet-meta">{networkName} • {balance}</div>
            </div>
          </div>
        ) : (
          <button className="connect-wallet-btn" onClick={handleWalletClick}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
