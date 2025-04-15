import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import sparkIcon from '../public/images/sparkIcon.png';
import convertLeft from '../public/images/convert-left.svg';
import convertRight from '../public/images/convert-right.svg';
import '../styles/Dashboard.css'; // Reusing existing styles for icons/buttons

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      className="landing-wrapper"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Box className="hero-icons">
        <img src={convertLeft} alt="Convert Left" className="convert-icon" />
        <img src={sparkIcon} alt="DeGenWatts Logo" className="spark-logo" />
        <img src={convertRight} alt="Convert Right" className="convert-icon" />
      </Box>
      <h1>
        Welcome to <span style={{ color: '#00d0ff' }}>DegenWatts</span>
      </h1>
      <p style={{ maxWidth: '600px', textAlign: 'center', margin: '1rem 0' }}>
        Buy and sell electricity using our decentralized peer-to-peer (P2P) energy trading platform built on blockchain & IoT.
      </p>
      <button className="cta-button" onClick={() => navigate('/dashboard')}>
        Get Started
      </button>
      

    </Box>
    
  );
};

export default Landing;
