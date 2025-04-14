const UserRegistry = artifacts.require("UserRegistry");

contract("UserRegistry", (accounts) => {
  const [owner, producer1, consumer1] = accounts;
  let registry;

  beforeEach(async () => {
    registry = await UserRegistry.new({ from: owner });
  });

  describe("User Registration", () => {
    it("should register a producer", async () => {
      await registry.registerUser("Solar Farm 1", true, false, { from: producer1 });
      const user = await registry.getUser(producer1);
      assert.equal(user.isProducer, true, "Account should be registered as producer");
    });

    it("should register a consumer", async () => {
      await registry.registerUser("Home User 1", false, true, { from: consumer1 });
      const user = await registry.getUser(consumer1);
      assert.equal(user.isConsumer, true, "Account should be registered as consumer");
    });

    it("should not allow double registration", async () => {
      await registry.registerUser("Solar Farm 1", true, false, { from: producer1 });
      try {
        await registry.registerUser("Home User 1", false, true, { from: producer1 });
        assert.fail("Should not allow double registration");
      } catch (error) {
        assert(error.message.includes("User already registered"));
      }
    });
  });

  describe("User Information", () => {
    it("should store and retrieve user information", async () => {
      const producerName = "Solar Farm 1";
      await registry.registerUser(producerName, true, false, { from: producer1 });
      const userInfo = await registry.getUser(producer1);
      assert.equal(userInfo.name, producerName, "User name should match");
      assert.equal(userInfo.isProducer, true, "Should be marked as producer");
      assert.equal(userInfo.isConsumer, false, "Should not be marked as consumer");
    });
  });

  describe("User Status", () => {
    it("should allow admin to suspend users", async () => {
      await registry.registerUser("Solar Farm 1", true, false, { from: producer1 });
      await registry.updateUserStatus(producer1, false, { from: owner });
      const userInfo = await registry.getUser(producer1);
      assert.equal(userInfo.isActive, false, "User should be suspended");
    });

    it("should not allow non-admin to suspend users", async () => {
      await registry.registerUser("Solar Farm 1", true, false, { from: producer1 });
      try {
        await registry.updateUserStatus(producer1, false, { from: consumer1 });
        assert.fail("Non-admin should not be able to suspend users");
      } catch (error) {
        assert(error.message.includes("revert"));
      }
    });
  });
});