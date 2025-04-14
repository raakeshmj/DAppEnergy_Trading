import React from'react';
import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ web3, account }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!web3 || !account) return;

      try {
        // Load contract ABIs
        const response = await fetch('/build/contracts/UserRegistry.json');
        const UserRegistryContract = await response.json();
        
        // Create contract instances
        const networkId = await web3.eth.net.getId();
        const networkData = UserRegistryContract.networks[networkId];
        
        if (!networkData) {
          throw new Error('Smart contract not deployed to detected network');
        }
        
        const userRegistry = new web3.eth.Contract(
          UserRegistryContract.abi,
          networkData.address
        );

        // Get user information
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Account Overview
            </Typography>
            <Typography>
              Account Type: {userInfo?.isProducer ? 'Energy Producer' : 'Energy Consumer'}
            </Typography>
            <Typography>
              Status: {userInfo?.isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={() => navigate('/create-listing')}
          >
            <Typography variant="h6" gutterBottom>
              Sell Energy
            </Typography>
            <Typography>
              Create new energy listings and manage your existing ones.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={() => navigate('/view-listings')}
          >
            <Typography variant="h6" gutterBottom>
              Buy Energy
            </Typography>
            <Typography>
              Browse available energy listings and place bids.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;