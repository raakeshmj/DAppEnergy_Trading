// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EnergyToken.sol";
import "./UserRegistry.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EnergyTradingPlatform is ReentrancyGuard {
    struct EnergyListing {
        uint256 id;
        address seller;
        uint256 energyAmount;
        uint256 pricePerUnit;
        bool isActive;
        uint256 timestamp;
    }

    struct Bid {
        uint256 id;
        address buyer;
        uint256 listingId;
        uint256 bidAmount;
        uint256 timestamp;
        bool isAccepted;
    }

    EnergyToken public energyToken;
    UserRegistry public userRegistry;
    
    uint256 public listingCounter;
    uint256 public bidCounter;
    mapping(uint256 => EnergyListing) public listings;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => uint256[]) public listingBids;

    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 energyAmount, uint256 pricePerUnit);
    event BidPlaced(uint256 indexed bidId, uint256 indexed listingId, address indexed buyer, uint256 bidAmount);
    event BidAccepted(uint256 indexed bidId, uint256 indexed listingId);
    event ListingCancelled(uint256 indexed listingId);

    constructor(address _energyToken, address _userRegistry) {
        energyToken = EnergyToken(_energyToken);
        userRegistry = UserRegistry(_userRegistry);
    }

    function createListing(uint256 _energyAmount, uint256 _pricePerUnit) external {
        require(userRegistry.isRegisteredUser(msg.sender), "User not registered");
        require(_energyAmount > 0, "Energy amount must be greater than 0");
        require(_pricePerUnit > 0, "Price must be greater than 0");

        listingCounter++;
        listings[listingCounter] = EnergyListing({
            id: listingCounter,
            seller: msg.sender,
            energyAmount: _energyAmount,
            pricePerUnit: _pricePerUnit,
            isActive: true,
            timestamp: block.timestamp
        });

        emit ListingCreated(listingCounter, msg.sender, _energyAmount, _pricePerUnit);
    }

    function placeBid(uint256 _listingId) external payable nonReentrant {
        require(userRegistry.isRegisteredUser(msg.sender), "User not registered");
        EnergyListing storage listing = listings[_listingId];
        require(listing.isActive, "Listing is not active");
        require(msg.sender != listing.seller, "Seller cannot bid");
        require(msg.value >= listing.energyAmount * listing.pricePerUnit, "Insufficient bid amount");

        bidCounter++;
        bids[bidCounter] = Bid({
            id: bidCounter,
            buyer: msg.sender,
            listingId: _listingId,
            bidAmount: msg.value,
            timestamp: block.timestamp,
            isAccepted: false
        });

        listingBids[_listingId].push(bidCounter);
        emit BidPlaced(bidCounter, _listingId, msg.sender, msg.value);
    }

    function acceptBid(uint256 _bidId) external nonReentrant {
        Bid storage bid = bids[_bidId];
        EnergyListing storage listing = listings[bid.listingId];
        
        require(msg.sender == listing.seller, "Only seller can accept bid");
        require(listing.isActive, "Listing is not active");
        require(!bid.isAccepted, "Bid already accepted");

        listing.isActive = false;
        bid.isAccepted = true;

        // Transfer energy tokens from seller to buyer
        require(energyToken.transferFrom(listing.seller, bid.buyer, listing.energyAmount), "Energy token transfer failed");
        
        // Transfer payment to seller
        (bool sent, ) = payable(listing.seller).call{value: bid.bidAmount}("");
        require(sent, "Failed to send payment");

        emit BidAccepted(_bidId, bid.listingId);
    }

    function cancelListing(uint256 _listingId) external {
        EnergyListing storage listing = listings[_listingId];
        require(msg.sender == listing.seller, "Only seller can cancel listing");
        require(listing.isActive, "Listing is not active");

        listing.isActive = false;
        emit ListingCancelled(_listingId);
    }

    function getListingBids(uint256 _listingId) external view returns (uint256[] memory) {
        return listingBids[_listingId];
    }
}