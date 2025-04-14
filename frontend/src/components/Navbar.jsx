import React from'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WalletConnect from './WalletConnect';

const Navbar = ({ account }) => {
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Energy Trading Platform
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/create-listing')}>
            Sell Energy
          </Button>
          <Button color="inherit" onClick={() => navigate('/view-listings')}>
            Buy Energy
          </Button>
          <WalletConnect account={account} onConnect={handleConnect} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;