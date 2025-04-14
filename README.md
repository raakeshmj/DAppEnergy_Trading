# P2P Energy Trading Platform

A blockchain-based peer-to-peer energy trading platform that enables prosumers to trade energy tokens directly with each other. Built using Solidity smart contracts and Truffle framework.

## Features

- ERC20-based Energy Token (ENRG) for representing energy units
- User registration system for energy producers and consumers
- P2P energy trading marketplace with listing and bidding functionality
- Reputation system for users
- Secure transaction settlement and payment processing

## Smart Contracts

1. **EnergyToken.sol**: ERC20 token contract for representing energy units
2. **UserRegistry.sol**: Manages user profiles and roles (producer/consumer)
3. **EnergyTradingPlatform.sol**: Core trading platform for energy exchange

## Prerequisites

- Node.js (v14 or higher)
- Truffle Suite
- Ganache (for local blockchain)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Ganache:
   - Launch Ganache
   - Create a new workspace
   - Configure RPC Server to run on `HTTP://127.0.0.1:7545`

3. Deploy contracts:
   ```bash
   truffle migrate --reset
   ```

## Usage

1. Register as a user (producer or consumer)
2. If you're a producer:
   - Create energy listings with amount and price
   - Accept bids from consumers
3. If you're a consumer:
   - Browse active energy listings
   - Place bids on listings
   - Receive energy tokens upon successful trades

## Testing

Run the test suite:
```bash
truffle test
```

## License

MIT