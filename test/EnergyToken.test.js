const EnergyToken = artifacts.require("EnergyToken");

contract("EnergyToken", (accounts) => {
  const [owner, user1, user2] = accounts;
  const initialSupply = web3.utils.toWei("1000000", "ether");
  let token;

  beforeEach(async () => {
    token = await EnergyToken.new({ from: owner });
  });

  describe("Token Basics", () => {
    it("should have correct name and symbol", async () => {
      const name = await token.name();
      const symbol = await token.symbol();
      assert.equal(name, "Energy Token");
      assert.equal(symbol, "ENRG");
    });

    it("should assign initial supply to owner", async () => {
      const ownerBalance = await token.balanceOf(owner);
      assert.equal(ownerBalance.toString(), initialSupply);
    });
  });

  describe("Token Transfers", () => {
    const transferAmount = web3.utils.toWei("1000", "ether");

    it("should transfer tokens between accounts", async () => {
      await token.transfer(user1, transferAmount, { from: owner });
      const user1Balance = await token.balanceOf(user1);
      assert.equal(user1Balance.toString(), transferAmount);
    });

    it("should fail when transferring more than balance", async () => {
      try {
        await token.transfer(user2, web3.utils.toWei("2000000", "ether"), { from: user1 });
        assert.fail("Transfer should have failed");
      } catch (error) {
        assert(error.message.includes("revert"));
      }
    });
  });

  describe("Token Approvals", () => {
    const approvalAmount = web3.utils.toWei("5000", "ether");

    it("should approve tokens for delegated transfer", async () => {
      await token.approve(user1, approvalAmount, { from: owner });
      const allowance = await token.allowance(owner, user1);
      assert.equal(allowance.toString(), approvalAmount);
    });

    it("should handle delegated token transfers", async () => {
      await token.approve(user1, approvalAmount, { from: owner });
      await token.transferFrom(owner, user2, approvalAmount, { from: user1 });
      const user2Balance = await token.balanceOf(user2);
      assert.equal(user2Balance.toString(), approvalAmount);
    });
  });
});