require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const private_keys = [process.env.PRIVATE_KEY_0, process.env.PRIVATE_KEY_1];
const project_id = [process.env.PROJECT_ID];

module.exports = {
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: private_keys,
          providerOrUrl: `${project_id}`,
          numberOfAddress: 2,
        }),
      network_id: 4, // Rinkeby's id
      networkCheckTimeout: 1000000,
      gas: 5500000, // Rinkeby has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.11", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};
