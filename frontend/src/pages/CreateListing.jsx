import React from'react';
import { useState,useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../context/ContractContext';

const CreateListing = ({ web3, account }) => {
  const { tradingPlatform, userRegistry, loading: contractLoading, error: contractError } = useContracts();  const [energyAmount, setEnergyAmount] = useState('');
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
      handleSubmit(new Event('submit')); // Re-attempt listing creation
    } catch (err) {
      console.error('Registration failed:', err);
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
      console.error('Contracts not initialized');
      throw new Error('Contracts not initialized');
    }else{
      console.log('Contracts initialized');
    }

    console.log('Energy Amount:', energyAmount);
    console.log('Price per Unit:', pricePerUnit);


    setLoading(true);
    setError('');
    
    try {
      if (!tradingPlatform) {
        throw new Error('Trading platform contract not initialized');
      }

      const isRegistered = await userRegistry.methods.isRegisteredUser(account).call();
        
      if (!isRegistered) {
        setShowRegisterForm(true);
        setLoading(false);
        return;
      }

      // Convert energy amount and price to Wei
      const energyAmountWei = web3.utils.toWei(energyAmount, 'ether');
      const pricePerUnitWei = web3.utils.toWei(pricePerUnit, 'ether');


      // Create listing
      await tradingPlatform.methods
        .createListing(energyAmountWei, pricePerUnitWei)
        .send({ 
          from: account,
          gas: 5000000,
          gasPrice: await web3.eth.getGasPrice()
         });

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
          {showRegisterForm ? 'Register to Continue' : 'Create Energy Listing'}
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

        {showRegisterForm ? (
          <Box>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <label>
                <input
                  type="checkbox"
                  checked={isProducer}
                  onChange={() => setIsProducer(!isProducer)}
                />
                Producer
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={isConsumer}
                  onChange={() => setIsConsumer(!isConsumer)}
                />
                Consumer
              </label>
            </Box>
            <Button
              variant="contained"
              onClick={handleRegister}
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register & Continue'}
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Energy Amount (ETH)"
              type="number"
              value={energyAmount}
              onChange={(e) => setEnergyAmount(e.target.value)}
              margin="normal"
              required
              inputProps={{ min: '0', step: '0.0001' }}
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
        )}
      </Paper>
    </Container>
  );
};

export default CreateListing;