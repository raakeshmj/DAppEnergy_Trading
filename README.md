⚡ P2P Energy Trading Platform
A decentralized, blockchain-powered platform enabling prosumers (producers + consumers) to seamlessly trade energy using smart contracts. Built with Solidity, the Truffle Suite, and an ERC20-based energy token.

🚀 Key Features
🔋 ERC20 Energy Token (ENRG) – Tokenized energy units for trading

👥 User Registration – Onboard as a producer or consumer

🏷️ Marketplace – List, browse, and bid on energy offers

🌟 Reputation System – Track and reward trustworthy users

🔐 Secure Transactions – Blockchain-backed settlements & payments

🧠 Smart Contract Architecture
EnergyToken.sol – ERC20 token contract for ENRG

UserRegistry.sol – Manages user roles, identity, and registration

EnergyTradingPlatform.sol – The core trading engine handling listings, bids, and trades

🔧 Prerequisites
Node.js (v14 or above)

Truffle

Ganache (for local blockchain testing)

⚙️ Getting Started
1. Install Dependencies
bash
Copy
Edit
npm install
2. Start Ganache
Open Ganache and create a new workspace

Set RPC server to: HTTP://127.0.0.1:8545

3. Compile & Deploy Smart Contracts
bash
Copy
Edit
truffle migrate --reset
💡 How It Works
✅ Register
Sign up as either a producer or a consumer

🔄 If You’re a Producer:
List energy tokens with a custom price

Accept bids from interested consumers

📥 If You’re a Consumer:
Browse active listings

Place bids on available energy offers

Receive ENRG tokens after trade confirmation

🧪 Running Tests
Run the full test suite:

bash
Copy
Edit
truffle test
📄 License
This project is licensed under the MIT License.

