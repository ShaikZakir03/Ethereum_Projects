const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet Contract", function () {
  let Faucet;
  let faucet;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
    await faucet.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy the contract and set owner correctly", async function () {
      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should allow the owner to deposit funds", async function () {
      const depositAmount = ethers.parseEther("0.1");
      await faucet.deposit({ value: depositAmount });
      expect(await ethers.provider.getBalance(faucet.target)).to.equal(depositAmount);
    });
  });

  describe("Airdrop functionality", function () {
    it("should allow a user to claim the airdrop after 24 hours", async function () {
      // First deposit some funds
      await faucet.deposit({ value: ethers.parseEther("0.1") });
      
      // Fast forward time by 25 hours
      await ethers.provider.send("evm_increaseTime", [25 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      // Claim airdrop
      await faucet.connect(addr1).airdrop(addr1.address);
      expect(await ethers.provider.getBalance(addr1.address)).to.be.gt(0);
    });

    it("should not allow users to claim more than once within 24 hours", async function () {
      // First deposit some funds
      await faucet.deposit({ value: ethers.parseEther("0.1") });
      
      // Claim first time
      await faucet.connect(addr1).airdrop(addr1.address);
      
      // Try to claim again immediately
      await expect(
        faucet.connect(addr1).airdrop(addr1.address)
      ).to.be.revertedWith("Claim time has not passed yet");
    });

    it("should not allow airdrop if there are insufficient funds in the faucet", async function () {
      // Try to claim without any funds in the faucet
      await expect(
        faucet.connect(addr1).airdrop(addr1.address)
      ).to.be.revertedWith("Not enough funds in the faucet");
    });
  });
});
