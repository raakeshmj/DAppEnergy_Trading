
import React, { createContext, useContext, useState, useEffect } from 'react';
import EnergyTradingPlatformContract from '../../../build/contracts/EnergyTradingPlatform.json';
import EnergyTokenContract from '../../../build/contracts/EnergyToken.json';
import UserRegistryContract from '../../../build/contracts/UserRegistry.json';

export const ContractContext = createContext();

export const ContractProvider = ({ children, web3, account }) => {
  const [contracts, setContracts] = useState({
    tradingPlatform: null,
    energyToken: null,
    userRegistry: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeContracts = async () => {
      if (!web3 || !account) {
        console.log("⛔ Web3 or account is null:", { web3, account });
        setLoading(false);
        return;
      }

      try {

        const chainId = await web3.eth.getChainId();
        console.log("Chain ID:", chainId);

        const networkId = Number(await web3.eth.net.getId());
        console.log('Network ID:', networkId);
        console.log("TradingPlatform:", EnergyTradingPlatformContract.networks);
        console.log("EnergyToken:", EnergyTokenContract.networks);
        console.log("UserRegistry:", UserRegistryContract.networks);

        // Load contract ABIs
        `const [tradingPlatformResponse, energyTokenResponse, userRegistryResponse] = await Promise.all([
          fetch('/build/contracts/EnergyTradingPlatform.json'),
          fetch('/build/contracts/EnergyToken.json'),
          fetch('/build/contracts/UserRegistry.json')
        ]);

        const [
          EnergyTradingPlatformContract,
          EnergyTokenContract,
          UserRegistryContract
        ] = await Promise.all([
          tradingPlatformResponse.json(),
          energyTokenResponse.json(),
          userRegistryResponse.json()
        ]);`

        // Get contract instances
        const tradingPlatformNetwork = EnergyTradingPlatformContract.networks[networkId];
        console.log("TradingPlatformNetwork:", tradingPlatformNetwork);
        const energyTokenNetwork = EnergyTokenContract.networks[networkId];
        const userRegistryNetwork = UserRegistryContract.networks[networkId];

        if (!tradingPlatformNetwork || !energyTokenNetwork || !userRegistryNetwork) {
          throw new Error('One or more contracts not deployed to the current network');
        }

        const tradingPlatform = new web3.eth.Contract(
          EnergyTradingPlatformContract.abi,
          tradingPlatformNetwork.address
        );

        const energyToken = new web3.eth.Contract(
          EnergyTokenContract.abi,
          energyTokenNetwork.address
        );

        const userRegistry = new web3.eth.Contract(
          UserRegistryContract.abi,
          userRegistryNetwork.address
        );

        setContracts({
          tradingPlatform,
          energyToken,
          userRegistry,
        });
      } catch (err) {
        console.error('Failed to initialize contracts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeContracts();
  }, [web3, account]);

  return (
    <ContractContext.Provider value={{ ...contracts, loading, error }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContracts must be used within a ContractProvider');
  }
  return context;
};