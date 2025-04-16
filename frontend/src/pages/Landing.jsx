// src/pages/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import sparkIcon from '../public/images/sparkIcon.png';
import convertLeft from '../public/images/convert-left.svg';
import convertRight from '../public/images/convert-right.svg';
import '../styles/Landing.css';

const steps = [
  {
    number: "1",
    title: "Connect Wallet",
    desc: "Securely link your crypto wallet to start trading energy.",
  },
  {
    number: "2",
    title: "Login as Buyer/Seller",
    desc: "Choose your role to either purchase energy or list it.",
  },
  {
    number: "3",
    title: "Trade Energy",
    desc: "Place bids using ETH or list your extra energy supply.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box className="landing-wrapper">
      <Box className="hero-icons">
        <img src={convertLeft} alt="Convert Left" className="convert-icon" />
        <img src={sparkIcon} alt="DeGenWatts Logo" className="spark-logo" />
        <img src={convertRight} alt="Convert Right" className="convert-icon" />
      </Box>

      <h1>
  Welcome to <span className="degenwatts-title">DegenWatts</span>
</h1>
      <p className="subtext">
        Buy and sell electricity using our decentralized peer-to-peer (P2P) energy trading platform built on blockchain & IoT.
      </p>
      <button className="cta-button" onClick={() => navigate('/dashboard')}>
        Get Started
      </button>

      <h2 className="how-to-title">How to use?</h2>
      <Box className="how-to-container">
        {steps.map((step) => (
          <Box key={step.number} className="step-card">
            <div className="step-number">{step.number}</div>
            <div className="step-title">{step.title}</div>
            <p className="step-desc">{step.desc}</p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Landing;
