// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Faucet {
    address public owner; // address of faucet owner (whoever is deploying contract)
    mapping(address => uint) public lastClaimed;
    uint public claimAmount = 0.1 ether;
    uint public cooldown = 24 hours;

    // Constructor to set the owner of the contract
    constructor() {
        owner = msg.sender;
    }

    // Function to request ETH from the faucet
    function requestEth() public {
        require(block.timestamp >= lastClaimed[msg.sender] + cooldown, "You can only claim once every 24 hours");
        require(address(this).balance >= claimAmount, "Faucet doesn't have enough funds");

        // Update the last claimed time
        lastClaimed[msg.sender] = block.timestamp;

        // Transfer the claim amount to the caller (msg.sender)
        payable(msg.sender).transfer(claimAmount);
    }

    // Function for the owner to deposit funds into the faucet
    function deposit() public payable {
        require(msg.sender == owner, "Only the owner can deposit funds");
    }

    // Function for the owner to withdraw funds from the faucet
    function withdraw(uint _amt) public {
        require(msg.sender == owner, "Only the owner can withdraw");
        require(_amt <= address(this).balance, "Not enough funds");

        // Transfer the requested amount to the owner
        payable(owner).transfer(_amt);
    }

    // Function to check the current balance of the faucet
    function checkBalance() public view returns (uint) {
        return address(this).balance;
    }
}
