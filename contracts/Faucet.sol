// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Faucet {
    uint public amount = 0.01 ether;  // Amount to be airdropped
    address public owner;
    uint public claim_time = 24 hours;

    mapping(address => uint) private _time_stamp; // Mapping of address to timestamp

    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Deposit function for the owner to fund the faucet
    function deposit() public payable onlyOwner {
        require(msg.value > 0, "Deposit must be greater than zero");
    }

    // Airdrop function to send ether to a specified address if 24 hours have passed
    function airdrop(address payable _addr) public {
        require(block.timestamp >= _time_stamp[_addr] + claim_time, "Claim time has not passed yet");
        require(address(this).balance >= amount, "Not enough funds in the faucet");

        _time_stamp[_addr] = block.timestamp; // Update timestamp

        // Transfer the amount to the address
        _addr.transfer(amount);
    }

    // Function to check the last claim time for an address
    function getLastClaimTime(address _addr) public view returns (uint) {
        return _time_stamp[_addr];
    }
}
