import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useContracts } from '../context/ContractContext';

const ViewListings = ({ web3, account }) => {
  const { tradingPlatform, loading: contractLoading, error: contractError } = useContracts();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    loadListings();
  }, [web3, account]);

  const loadListings = async () => {
    if (!web3 || !account || !tradingPlatform) return;

    try {
      const listingCount = await tradingPlatform.methods.listingCounter().call();
      const allListings = [];

      for (let i = 1; i <= listingCount; i++) {
        const listing = await tradingPlatform.methods.listings(i).call();
        allListings.push({
          ...listing,
          id: i,
          energyAmount: listing.energyAmount,
          pricePerUnit: listing.pricePerUnit,
        });
      }

      setListings(allListings);
    } catch (err) {
      console.error('Error loading listings:', err);
      setError('Error loading listings');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (listing) => {
    try {
      setBuyingId(listing.id);
      setError('');

      const totalPriceWei = (
        (BigInt(listing.energyAmount) * BigInt(listing.pricePerUnit)) /
        BigInt(1e18)
      ).toString();

      await tradingPlatform.methods
        .purchaseListing(listing.id)
        .send({ from: account, value: totalPriceWei });

      await loadListings(); // Refresh listings after purchase
    } catch (err) {
      console.error('Purchase failed:', err);
      setError(err.message || 'Failed to purchase listing');
    } finally {
      setBuyingId(null);
    }
  };

  if (!web3 || !account) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Please connect your wallet to view energy listings</Alert>
      </Container>
    );
  }

  if (loading || contractLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Energy Listings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {listings.map((listing) => {
          const totalPriceEth = (
            Number(web3.utils.fromWei(listing.energyAmount, 'ether')) *
            Number(web3.utils.fromWei(listing.pricePerUnit, 'ether'))
          ).toFixed(4);

          const isSold = !listing.isActive;
          const isSeller = listing.seller === account;

          return (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <Card sx={{ opacity: isSold ? 0.6 : 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Energy: {web3.utils.fromWei(listing.energyAmount, 'ether')} ETH
                  </Typography>
                  <Typography color="textSecondary">
                    Price per Unit: {web3.utils.fromWei(listing.pricePerUnit, 'ether')} ETH
                  </Typography>
                  <Typography color="textSecondary">
                    Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                  </Typography>
                  <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
                    Total Price: {totalPriceEth} ETH
                  </Typography>

                  {isSold ? (
                    <Chip label="SOLD" color="error" sx={{ mt: 2 }} />
                  ) : !isSeller ? (
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handlePurchase(listing)}
                      disabled={buyingId === listing.id}
                    >
                      {buyingId === listing.id ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Buy Now'
                      )}
                    </Button>
                  ) : (
                    <Chip label="Your Listing" color="info" sx={{ mt: 2 }} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ViewListings;