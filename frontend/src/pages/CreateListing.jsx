import React from'react';
import { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../context/ContractContext';

const CreateListing = ({ web3, account }) => {
  const { tradingPlatform, loading: contractLoading, error: contractError } = useContracts();
  const [energyAmount, setEnergyAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3 || !account) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      if (!tradingPlatform) {
        throw new Error('Trading platform contract not initialized');
      }

      // Convert energy amount and price to Wei
      const energyAmountWei = web3.utils.toWei(energyAmount, 'ether');
      const pricePerUnitWei = web3.utils.toWei(pricePerUnit, 'ether');

      // Create listing
      await tradingPlatform.methods
        .createListing(energyAmountWei, pricePerUnitWei)
        .send({ from: account });

      setSuccess(true);
      setTimeout(() => {
        navigate('/view-listings');
      }, 2000);
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  if (!web3 || !account) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please connect your wallet to create an energy listing
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create Energy Listing
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Listing created successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Energy Amount (ETH)"
            type="number"
            value={energyAmount}
            onChange={(e) => setEnergyAmount(e.target.value)}
            margin="normal"
            required
            inputProps={{ min: "0", step: "0.0001" }}
          />
          
          <TextField
            fullWidth
            label="Price per Unit (ETH)"
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            margin="normal"
            required
            inputProps={{ min: "0", step: "0.0001" }}
          />

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ height: 48 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Listing'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateListing;