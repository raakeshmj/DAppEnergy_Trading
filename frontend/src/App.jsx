import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Web3 from 'web3';
import Landing from './pages/Landing'; 
// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import ViewListings from './pages/ViewListings';
import { ContractProvider } from './context/ContractContext';
import './styles/App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#010d1a',
      paper: '#0a1a2f',
    },
    primary: {
      main: '#00d0ff',
    },
    secondary: {
      main: '#1c1f2a',
    },
    text: {
      primary: '#e0f7ff',
    },
  },
  typography: {
    fontFamily: 'Orbitron, sans-serif',
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

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          window.ethereum.on('chainChanged', () => {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-root">
        <Router>
          <ContractProvider web3={web3} account={account}>
            <Navbar account={account} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} /> {/* 👈 New landing page */}
                <Route path="/dashboard" element={<Dashboard web3={web3} account={account} />} />
                <Route path="/create-listing" element={<CreateListing web3={web3} account={account} />} />
                <Route path="/view-listings" element={<ViewListings web3={web3} account={account} />} />
              </Routes>
            </main>
          </ContractProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
