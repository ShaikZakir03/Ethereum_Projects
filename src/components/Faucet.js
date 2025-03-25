import { useState } from 'react';
import { ethers } from 'ethers';

const FAUCET_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const FAUCET_ABI = [
  "function airdrop(address payable _addr) public",
  "function deposit() public payable",
  "function getLastClaimTime(address _addr) public view returns (uint256)"
];

export default function Faucet() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function requestEth() {
    if (!address) {
      setStatus('Please enter an Ethereum address');
      return;
    }

    try {
      setLoading(true);
      setStatus('Requesting ETH...');

      // Connect to the provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance
      const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);

      // Call the airdrop function
      const tx = await faucet.airdrop(address);
      await tx.wait();

      setStatus('Success! ETH has been sent to your address');
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">ETH Faucet</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Your Ethereum Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <button
        onClick={requestEth}
        disabled={loading}
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : 'Get ETH'}
      </button>

      {status && (
        <p className={`mt-4 text-center ${
          status.includes('Error') ? 'text-red-500' : 'text-green-500'
        }`}>
          {status}
        </p>
      )}
    </div>
  );
} 