// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  AccountCircle,
  Bolt,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = ({ web3, account }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!web3 || !account) return;

      try {
        const response = await fetch('/build/contracts/UserRegistry.json');
        const UserRegistryContract = await response.json();

        const networkId = await web3.eth.net.getId();
        const networkData = UserRegistryContract.networks[networkId];

        if (!networkData) {
          throw new Error('Smart contract not deployed to detected network');
        }

        const userRegistry = new web3.eth.Contract(
          UserRegistryContract.abi,
          networkData.address
        );

        const user = await userRegistry.methods.getUser(account).call();
        setUserInfo(user);
      } catch (error) {
        console.error('Error loading user info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [web3, account]);

  if (!web3 || !account) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please connect your wallet to continue
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="dashboard-section">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper className="glass-card">
            <Box className="icon-title">
              <AccountCircle className="card-icon" />
              <Typography variant="h6">Account Overview</Typography>
            </Box>
            <Typography>
              Account Type: {userInfo?.isProducer ? 'Energy Producer' : 'Energy Consumer'}
            </Typography>
            <Typography>
              Status: {userInfo?.isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="glass-card sell-section">
            <Box className="icon-title">
              <Bolt className="card-icon" />
              <Typography variant="h6">Sell Energy</Typography>
            </Box>
            <Typography>
              Create new energy listings and manage your existing ones.
            </Typography>
            <Button className="glow-button" onClick={() => navigate('/create-listing')}>
              Sell
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="glass-card buy-section">
            <Box className="icon-title">
              <ShoppingCart className="card-icon" />
              <Typography variant="h6">Buy Energy</Typography>
            </Box>
            <Typography>
              Browse available energy listings and place bids.
            </Typography>
            <Button className="glow-button" onClick={() => navigate('/view-listings')}>
              Buy
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
