import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../context/ContractContext';
import { FlashOn, EnergySavingsLeaf } from '@mui/icons-material';
import '../styles/CreateListing.css';

const CreateListing = ({ web3, account }) => {
  const { tradingPlatform, userRegistry } = useContracts();
  const [energyAmount, setEnergyAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [isProducer, setIsProducer] = useState(false);
  const [isConsumer, setIsConsumer] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRegistration = async () => {
      if (userRegistry && account) {
        try {
          const registered = await userRegistry.methods.isRegisteredUser(account).call();
          setShowRegisterForm(!registered);
        } catch (err) {
          console.error('Error checking user registration:', err);
        }
      }
    };
    checkRegistration();
  }, [userRegistry, account]);

  const handleRegister = async () => {
    if (!name || (!isProducer && !isConsumer)) {
      setError('Please provide a name and select at least one role');
      return;
    }

    setLoading(true);
    try {
      await userRegistry.methods
        .registerUser(name, isProducer, isConsumer)
        .send({ from: account });

      setShowRegisterForm(false);
      handleSubmit(new Event('submit'));
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3 || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!energyAmount || !pricePerUnit || isNaN(energyAmount) || isNaN(pricePerUnit) || parseFloat(energyAmount) <= 0 || parseFloat(pricePerUnit) <= 0) {
      setError('Please enter valid energy amount and price per unit');
      return;
    }

    if (!tradingPlatform || !userRegistry) {
      throw new Error('Contracts not initialized');
    }

    setLoading(true);
    setError('');

    try {
      const isRegistered = await userRegistry.methods.isRegisteredUser(account).call();
      if (!isRegistered) {
        setShowRegisterForm(true);
        setLoading(false);
        return;
      }

      const energyAmountWei = web3.utils.toWei(energyAmount, 'ether');
      const pricePerUnitWei = web3.utils.toWei(pricePerUnit, 'ether');

      await tradingPlatform.methods
        .createListing(energyAmountWei, pricePerUnitWei)
        .send({
          from: account,
          gas: 5000000,
          gasPrice: await web3.eth.getGasPrice(),
        });

      setSuccess(true);
      const button = document.querySelector('.futuristic-button');
      if (button) {
        button.classList.add('lightning-flash');
        setTimeout(() => button.classList.remove('lightning-flash'), 1000);
      }
      setTimeout(() => navigate('/view-listings'), 2000);
    } catch (err) {
      setError(err.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  if (!web3 || !account) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="warning">Please connect your wallet to create a listing.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="listing-container">
      <Paper className="futuristic-paper">
        <Box className="header-box">
          <FlashOn className="pulse-icon" />
          <Typography variant="h4" className="form-title">
            {showRegisterForm ? 'Register to Continue' : 'Create Listing'}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Listing created successfully!</Alert>}

        {showRegisterForm ? (
          <Box>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              className="glass-input"
            />
            <Box display="flex" justifyContent="space-between" mt={2} className="checkbox-row">
              <label><input type="checkbox" checked={isProducer} onChange={() => setIsProducer(!isProducer)} /> Producer</label>
              <label><input type="checkbox" checked={isConsumer} onChange={() => setIsConsumer(!isConsumer)} /> Consumer</label>
            </Box>
            <Button
              fullWidth
              onClick={handleRegister}
              className="futuristic-button"
              disabled={loading}
              startIcon={<EnergySavingsLeaf />}
            >
              {loading ? <CircularProgress size={24} /> : 'Register & Continue'}
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Energy Amount (KWh)"
              type="number"
              value={energyAmount}
              onChange={(e) => setEnergyAmount(e.target.value)}
              margin="normal"
              required
              inputProps={{ min: '0', step: '1' }}
            />
            <TextField
              fullWidth
              label="Price per Unit (ETH)"
              type="number"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              margin="normal"
              required
              inputProps={{ min: '0', step: '0.0001' }}
              className="glass-input"
            />
            <Box mt={3}>
              <Button
                type="submit"
                fullWidth
                className={`futuristic-button ${loading ? 'button-loading' : ''}`}
                disabled={loading}
                startIcon={<FlashOn />}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Listing'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default CreateListing;
