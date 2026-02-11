# P2P Energy Trading Platform

A decentralized, blockchain-powered platform enabling **prosumers** (producers + consumers) to seamlessly trade energy using smart contracts. Built with **Solidity**, the **Truffle Suite**, and an ERC20-based energy token.

---

## Key Features

-  **ERC20 Energy Token (ENRG)** – Tokenized energy units for trading  
-  **User Registration** – Onboard as a producer or consumer  
-  **Marketplace** – List, browse, and bid on energy offers  
-  **Reputation System** – Track and reward trustworthy users  
- **Secure Transactions** – Blockchain-backed settlements & payments  

---

## Smart Contract Architecture

1. **`EnergyToken.sol`** – ERC20 token contract for ENRG  
2. **`UserRegistry.sol`** – Manages user roles, identity, and registration  
3. **`EnergyTradingPlatform.sol`** – The core trading engine handling listings, bids, and trades  

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)  
- [Truffle](https://trufflesuite.com/truffle/)  
- [Ganache](https://trufflesuite.com/ganache/) (for local blockchain testing)  

---

##  Getting Started

### 1. Install Dependencies
```bash
npm install

```
### 2. Start Ganache
- Open Ganache and create a new workspace  
- Set the RPC server to: `HTTP://127.0.0.1:8545`

### 3. Compile & Deploy Smart Contracts
```bash
truffle migrate --reset

```
## How It Works

### Register
Sign up as either a **producer** or a **consumer**.

### If You’re a Producer
- Create energy listings with the amount and price
- Accept bids from consumers

### If You’re a Consumer
- Browse active energy listings
- Place bids on offers
- Receive ENRG tokens after successful trades

## Running Tests

Run the full test suite:
```bash
truffle test

