const EnergyTradingPlatform = artifacts.require("EnergyTradingPlatform");
const EnergyToken = artifacts.require("EnergyToken");
const UserRegistry = artifacts.require("UserRegistry");

contract("EnergyTradingPlatform", (accounts) => {
  const [owner, producer1, consumer1] = accounts;
  const initialSupply = web3.utils.toWei("1000000", "ether");
  const listingAmount = web3.utils.toWei("1", "ether");
  const pricePerToken = web3.utils.toWei("0.001", "ether");

  let platform;
  let token;
  let registry;

  beforeEach(async () => {
    // Deploy and set up contracts
    token = await EnergyToken.new({ from: owner });
    registry = await UserRegistry.new({ from: owner });
    platform = await EnergyTradingPlatform.new(token.address, registry.address, { from: owner });
    await token.approve(platform.address, initialSupply, { from: owner });

    // Register users
    await registry.registerUser("Solar Farm 1", true, false, { from: producer1 });
    await registry.registerUser("Home User 1", false, true, { from: consumer1 });

    // Transfer tokens to producer
    await token.transfer(producer1, web3.utils.toWei("1000", "ether"), { from: owner });
    // Approve platform to handle tokens
    await token.approve(platform.address, web3.utils.toWei("1000", "ether"), { from: producer1 });
  });

  describe("Listing Management", () => {
    it("should create energy listing", async () => {
      await platform.createListing(listingAmount, pricePerToken, { from: producer1 });
      const listing = await platform.listings(1);
      
      assert.equal(listing.seller, producer1, "Incorrect seller");
      assert.equal(listing.energyAmount.toString(), listingAmount, "Incorrect amount");
      assert.equal(listing.pricePerUnit.toString(), pricePerToken, "Incorrect price");
      assert.equal(listing.isActive, true, "Listing should be active");
    });

    it("should not allow non-producers to create listings", async () => {
      try {
        await platform.createListing(listingAmount, pricePerToken, { from: consumer1 });
        assert.fail("Should not allow non-producers to create listings");
      } catch (error) {
        assert(error.message.includes("revert"));
      }
    });
  });

  describe("Bidding System", () => {
    beforeEach(async () => {
      await platform.createListing(listingAmount, pricePerToken, { from: producer1 });
    });

    it("should place bid on listing", async () => {
      const totalPrice = web3.utils.toBN(listingAmount).mul(web3.utils.toBN(pricePerToken)).div(web3.utils.toBN(web3.utils.toWei("1", "ether")));
      await platform.placeBid(1, { 
        from: consumer1,
        value: totalPrice.toString()
      });

      const bid = await platform.bids(1);
      assert.equal(bid.buyer, consumer1, "Incorrect buyer");
      assert.equal(bid.bidAmount.toString(), totalPrice.toString(), "Incorrect bid amount");
    });

    it("should not allow bids with insufficient payment", async () => {
      try {
        await platform.placeBid(1, { 
          from: consumer1,
          value: web3.utils.toWei("0.01", "ether")
        });
        assert.fail("Should not allow bids with insufficient payment");
      } catch (error) {
        assert(error.message.includes("Insufficient bid amount"));
      }
    });
  });

  describe("Trade Settlement", () => {
    let bidId;
    const bidAmount = web3.utils.toWei("50", "ether");

    beforeEach(async () => {
      await platform.createListing(listingAmount, pricePerToken, { from: producer1 });
      const totalPrice = web3.utils.toBN(listingAmount).mul(web3.utils.toBN(pricePerToken)).div(web3.utils.toBN(web3.utils.toWei("1", "ether")));
      await platform.placeBid(1, { 
        from: consumer1,
        value: totalPrice.toString()
      });
      bidId = 0;
    });

    it("should settle trade successfully", async () => {
      const initialProducerBalance = await token.balanceOf(producer1);
      const initialConsumerBalance = await token.balanceOf(consumer1);

      await platform.acceptBid(1, { from: producer1 });

      const finalProducerBalance = await token.balanceOf(producer1);
      const finalConsumerBalance = await token.balanceOf(consumer1);

      assert(finalProducerBalance.lt(initialProducerBalance), "Producer balance should decrease");
      assert(finalConsumerBalance.gt(initialConsumerBalance), "Consumer balance should increase");
    });

    it("should update listing status after settlement", async () => {
      await platform.acceptBid(bidId, { from: producer1 });
      const listing = await platform.listings(1);
      assert.equal(listing.isActive, false, "Listing should be inactive after settlement");
    });
  });
});