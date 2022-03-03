const ETHpool = artifacts.require("ETHPool");

module.exports = function (deployer) {
  deployer.deploy(ETHpool);
};
