# Ethereum Sepolia Faucet

A decentralized faucet application that allows users to request test ETH on the Sepolia testnet. Built with Next.js, Hardhat, and ethers.js.

## Features

- Request 0.01 ETH from the faucet
- 24-hour cooldown period between requests
- Owner can deposit ETH to fund the faucet
- Built with Next.js 13+ (App Router)
- Smart contract deployed on Sepolia testnet
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Some Sepolia ETH for deployment and faucet funding

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd eth-faucet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
```

## Smart Contract Deployment

1. Deploy the Faucet contract to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

2. Copy the deployed contract address and update it in `src/app/components/Faucet.js`:
```javascript
const FAUCET_ADDRESS = 'your_deployed_contract_address';
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using the Faucet

1. **Connect Wallet**:
   - Click the "Connect Wallet" button
   - Approve the connection in MetaMask
   - Make sure you're connected to Sepolia network

2. **For Contract Owner**:
   - If your connected wallet is the contract owner, you'll see a "Deposit 0.1 ETH to Faucet" button
   - Click it to fund the faucet with 0.1 ETH
   - Approve the transaction in MetaMask

3. **Request ETH**:
   - Enter the recipient's Ethereum address
   - Click "Get ETH"
   - Approve the transaction in MetaMask
   - Wait for the transaction to be confirmed

## Important Notes

- Users can only request ETH once every 24 hours
- The faucet sends 0.01 ETH per request
- Make sure you have enough Sepolia ETH for gas fees
- The faucet must have sufficient funds to process requests

## Project Structure

```
eth-faucet/
├── contracts/
│   └── Faucet.sol
├── scripts/
│   └── deploy.js
├── src/
│   └── app/
│       ├── components/
│       │   └── Faucet.js
│       ├── page.js
│       └── layout.js
├── .env
├── hardhat.config.js
└── package.json
```

## Smart Contract Details

The Faucet contract includes the following functions:
- `deposit()`: Allows the owner to deposit ETH into the faucet
- `airdrop(address)`: Sends 0.01 ETH to the specified address
- `getLastClaimTime(address)`: Returns the last time an address claimed ETH

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.org/)
- [Tailwind CSS](https://tailwindcss.com/)
