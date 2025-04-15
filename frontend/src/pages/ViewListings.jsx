import React from'react';
import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useContracts } from '../context/ContractContext';

const ViewListings = ({ web3, account }) => {
  const { tradingPlatform, loading: contractLoading, error: contractError } = useContracts();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);

  useEffect(() => {
    loadListings();
  }, [web3, account]);

  const loadListings = async () => {
    if (!web3 || !account) return;

    try {
      if (!tradingPlatform) {
        throw new Error('Trading platform contract not initialized');
      }

      // Get total number of listings
      const listingCount = await tradingPlatform.methods.listingCounter().call();
      
      // Load all active listings
      const activeListings = [];
      for (let i = 1; i <= listingCount; i++) {
        const listing = await tradingPlatform.methods.listings(i).call();
        if (listing.isActive) {
          activeListings.push({
            ...listing,
            id: i,
            energyAmount: web3.utils.fromWei(listing.energyAmount, 'ether'),
            pricePerUnit: web3.utils.fromWei(listing.pricePerUnit, 'ether')
          });
        }
      }

      setListings(activeListings);
    } catch (error) {
      console.error('Error loading listings:', error);
      setError('Error loading listings');
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async () => {
    if (!selectedListing) return;

    setBidLoading(true);
    setError('');

    try {
      if (!tradingPlatform) {
        throw new Error('Trading platform contract not initialized');
      }

      const totalPrice = web3.utils.toBN(selectedListing.energyAmount)
        .mul(web3.utils.toBN(selectedListing.pricePerUnit))
        .toString();

      await tradingPlatform.methods
        .placeBid(selectedListing.id)
        .send({ from: account, value: totalPrice });

      setBidDialogOpen(false);
      loadListings(); // Refresh listings
    } catch (error) {
      console.error('Error placing bid:', error);
      setError(error.message || 'Error placing bid');
    } finally {
      setBidLoading(false);
    }
  };

  if (!web3 || !account) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please connect your wallet to view energy listings
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Energy Listings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Energy Amount: {listing.energyAmount} ETH
                </Typography>
                <Typography color="textSecondary">
                  Price per Unit: {listing.pricePerUnit} ETH
                </Typography>
                <Typography color="textSecondary">
                  Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setSelectedListing(listing);
                    setBidDialogOpen(true);
                  }}
                  disabled={listing.seller === account}
                >
                  Place Bid
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)}>
        <DialogTitle>Place Bid</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Total Price: {selectedListing ? 
              (parseFloat(selectedListing.energyAmount) * parseFloat(selectedListing.pricePerUnit)).toFixed(4) : 0} ETH
          </Typography>
          <Typography variant="caption" color="textSecondary">
            This amount will be locked in the smart contract until the seller accepts or rejects your bid.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBid}
            variant="contained"
            disabled={bidLoading}
          >
            {bidLoading ? <CircularProgress size={24} /> : 'Confirm Bid'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewListings;