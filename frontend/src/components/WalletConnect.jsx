import React from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const WalletConnect = ({ account, onConnect }) => {
  const handleConnect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application!');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    onConnect();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {!account ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleConnect}
          startIcon={<AccountBalanceWalletIcon />}
          sx={{ borderRadius: 2 }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'rgba(255,255,255,0.1)',
          padding: '4px 12px',
          borderRadius: 2,
          cursor: 'default'
        }}>
          <AccountBalanceWalletIcon />
          <Typography variant="body2">
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WalletConnect;