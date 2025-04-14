import React from'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Web3 from 'web3';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import ViewListings from './pages/ViewListings';
import { ContractProvider } from './context/ContractContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          const netId = await web3Instance.eth.net.getId();
          
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setNetworkId(netId);

          // Handle account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          // Handle network changes
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });
        } catch (error) {
          console.error('User denied account access');
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    initWeb3();
  }, []);

  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ContractProvider web3={web3} account={account}>
          <Navbar account={account} />
          <Routes>
            <Route path="/" element={<Dashboard web3={web3} account={account} />} />
            <Route path="/create-listing" element={<CreateListing web3={web3} account={account} />} />
            <Route path="/view-listings" element={<ViewListings web3={web3} account={account} />} />
          </Routes>
        </ContractProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;