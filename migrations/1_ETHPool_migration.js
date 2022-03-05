const ETHpool = artifacts.require("ETHpool");

module.exports = function (deployer) {
  deployer.deploy(ETHpool);
};
