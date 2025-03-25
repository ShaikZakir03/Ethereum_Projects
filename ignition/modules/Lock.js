const { buildModule } = require("@nomicfoundation/hardhat-ignition-ethers");

module.exports = buildModule("FaucetModule", (m) => {
  // Deploy the Faucet contract
  const faucet = m.contract("Faucet", [
    "0.01 ether", // Amount to be airdropped
    m.deployer,   // Owner address
    "24 hours",   // Claim time interval
  ]);

  // Return the deployed contract instance
  return { faucet };
});
