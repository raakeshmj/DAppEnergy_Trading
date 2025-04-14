// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserRegistry is Ownable {
    struct User {
        string name;
        bool isProducer;
        bool isConsumer;
        bool isActive;
        uint256 reputation;
        address userAddress;
    }

    mapping(address => User) public users;
    address[] public userAddresses;

    event UserRegistered(address indexed userAddress, string name, bool isProducer, bool isConsumer);
    event UserUpdated(address indexed userAddress, bool isActive, uint256 reputation);

    function registerUser(
        string memory _name,
        bool _isProducer,
        bool _isConsumer
    ) public {
        require(!users[msg.sender].isActive, "User already registered");
        require(_isProducer || _isConsumer, "User must be either producer or consumer");

        users[msg.sender] = User({
            name: _name,
            isProducer: _isProducer,
            isConsumer: _isConsumer,
            isActive: true,
            reputation: 100,
            userAddress: msg.sender
        });

        userAddresses.push(msg.sender);
        emit UserRegistered(msg.sender, _name, _isProducer, _isConsumer);
    }

    function isProducer(address _userAddress) public view returns (bool) {
        return users[_userAddress].isProducer && users[_userAddress].isActive;
    }

    function isConsumer(address _userAddress) public view returns (bool) {
        return users[_userAddress].isConsumer && users[_userAddress].isActive;
    }

    function getUserInfo(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }

    function suspendUser(address _userAddress) public onlyOwner {
        require(users[_userAddress].userAddress != address(0), "User does not exist");
        users[_userAddress].isActive = false;
        emit UserUpdated(_userAddress, false, users[_userAddress].reputation);
    }

    function updateUserStatus(address _userAddress, bool _isActive) public onlyOwner {
        require(users[_userAddress].userAddress != address(0), "User does not exist");
        users[_userAddress].isActive = _isActive;
        emit UserUpdated(_userAddress, _isActive, users[_userAddress].reputation);
    }

    function updateReputation(address _userAddress, uint256 _reputation) public onlyOwner {
        require(users[_userAddress].userAddress != address(0), "User does not exist");
        require(_reputation <= 100, "Reputation must be between 0 and 100");
        users[_userAddress].reputation = _reputation;
        emit UserUpdated(_userAddress, users[_userAddress].isActive, _reputation);
    }

    function getUser(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }

    function getUserCount() public view returns (uint256) {
        return userAddresses.length;
    }

    function isRegisteredUser(address _userAddress) public view returns (bool) {
        return users[_userAddress].isActive;
    }
}