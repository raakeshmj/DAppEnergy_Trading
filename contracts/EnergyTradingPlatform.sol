// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTradingPlatform {
    struct Listing {
        uint256 id;
        address payable seller;
        uint256 energyAmount;     // In wei
        uint256 pricePerUnit;     // In wei
        bool isActive;
    }

    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;

    event ListingCreated(uint256 id, address seller, uint256 energyAmount, uint256 pricePerUnit);
    event ListingPurchased(uint256 id, address buyer, uint256 totalAmount);

    function createListing(uint256 energyAmount, uint256 pricePerUnit) external {
        listingCounter++;
        listings[listingCounter] = Listing({
            id: listingCounter,
            seller: payable(msg.sender),
            energyAmount: energyAmount,
            pricePerUnit: pricePerUnit,
            isActive: true
        });

        emit ListingCreated(listingCounter, msg.sender, energyAmount, pricePerUnit);
    }

    function purchaseListing(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");

        uint256 totalCost = (listing.energyAmount * listing.pricePerUnit) / 1 ether;
        require(msg.value == totalCost, "Incorrect payment amount");

        listing.seller.transfer(msg.value);
        listing.isActive = false;

        emit ListingPurchased(listingId, msg.sender, msg.value);
    }
}