var ERC20TokenBalance = artifacts.require("./ERC20TokenBalance.sol");
module.exports = function(deployer) {
	deployer.deploy(ERC20TokenBalance);
};
