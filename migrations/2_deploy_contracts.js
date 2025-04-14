const EnergyToken = artifacts.require("EnergyToken");
const UserRegistry = artifacts.require("UserRegistry");
const EnergyTradingPlatform = artifacts.require("EnergyTradingPlatform");

module.exports = async function(deployer) {
  // Deploy EnergyToken
  await deployer.deploy(EnergyToken);
  const energyToken = await EnergyToken.deployed();

  // Deploy UserRegistry
  await deployer.deploy(UserRegistry);
  const userRegistry = await UserRegistry.deployed();

  // Deploy EnergyTradingPlatform with addresses of EnergyToken and UserRegistry
  await deployer.deploy(EnergyTradingPlatform, energyToken.address, userRegistry.address);
};