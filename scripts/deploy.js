const hre = require("hardhat");

async function main() {
  console.log("Deploying Faucet contract...");

  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy();

  await faucet.waitForDeployment();

  console.log("Faucet deployed to:", await faucet.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 