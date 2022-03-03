const ETHpool = artifacts.require("ETHpool");
const expect = require("chai").expect;

contract("ETHpool", (account) => {
  [Team, personA, personB, personC] = account;
  console.log(personA, personB, personC, Team);

  let ETHpoolInstance;
  beforeEach(async () => {
    ETHpoolInstance = await ETHpool.new({ from: Team });
  });

  AudioContext("Constructor", async () => {
    it("Owner must be Team", async () => {
      const owner = await ETHpoolInstance.owner();
      expect(owner).to.equal(Team);
    });
  });
});
