'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const FAUCET_ADDRESS = '0x16aA442bA94B19fC7217BBc41015E62c8d0b0dD8';
const FAUCET_ABI = [
  "function airdrop(address payable _addr) public",
  "function deposit() public payable",
  "function getLastClaimTime(address _addr) public view returns (uint256)",
  "function owner() public view returns (address)"
];

export default function Faucet() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [contractOwner, setContractOwner] = useState('');

  // Check if connected account is owner
  async function checkOwner() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);
      const owner = await faucet.owner();
      const signerAddress = await signer.getAddress();
      
      console.log('Contract Owner:', owner);
      console.log('Connected Address:', signerAddress);
      console.log('Is Owner:', owner.toLowerCase() === signerAddress.toLowerCase());
      
      setConnectedAddress(signerAddress);
      setContractOwner(owner);
      setIsOwner(owner.toLowerCase() === signerAddress.toLowerCase());
    } catch (error) {
      console.error('Error checking owner:', error);
      setStatus(`Error checking owner: ${error.message}`);
    }
  }

  // Connect wallet and check owner status
  async function connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkOwner();
      setStatus('Wallet connected!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatus('Error connecting wallet');
    }
  }

  async function depositEth() {
    try {
      setLoading(true);
      setStatus('Depositing ETH...');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);

      // Deposit 0.1 ETH
      const depositAmount = ethers.parseEther("0.1");
      const tx = await faucet.deposit({ value: depositAmount });
      await tx.wait();

      setStatus('Success! ETH has been deposited to the faucet');
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

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
      <h1 className="text-2xl font-bold mb-6 text-center">Sepolia ETH Faucet</h1>
      
      <button
        onClick={connectWallet}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
      >
        Connect Wallet
      </button>

      {connectedAddress && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Connected Address: {connectedAddress}
          </p>
          <p className="text-sm text-gray-600">
            Contract Owner: {contractOwner}
          </p>
          <p className="text-sm text-gray-600">
            Is Owner: {isOwner ? 'Yes' : 'No'}
          </p>
        </div>
      )}

      {isOwner && (
        <button
          onClick={depositEth}
          disabled={loading}
          className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          Deposit 0.1 ETH to Faucet
        </button>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Recipient Ethereum Address
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