const ETHpool = artifacts.require("ETHpool");
const expect = require("chai").expect;

contract("ETHpool", (account) => {
  [Team, A, B, C] = account;
  console.log(A, B, C, Team);

  let ETHpoolInstance;
  beforeEach(async () => {
    ETHpoolInstance = await ETHpool.new({ from: Team });
  });

  context("Constructor", async () => {
    it("Owner must be Team", async () => {
      const owner = await ETHpoolInstance.owner();
      expect(owner).to.equal(Team);
    });
  });

  context("Execution", async () => {
    it("A deposits then B deposits then Team deposits then both withdraw", async () => {
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      await ETHpoolInstance.depositRewards(300, { from: Team });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.words[0]).to.equal(
        (300 * 200) / 300 + 200
      );
      expect(balanceB.logs[0].args.amount.words[0]).to.equal(
        (300 * 100) / 300 + 100
      );
    });

    it("A deposits then Team deposits then B deposits then both withdraw", async () => {
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositRewards(300, { from: Team });
      await ETHpoolInstance.depositToPool(100, { from: B });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.words[0]).to.equal(
        (300 * 200) / 200 + 200
      );
      expect(balanceB.logs[0].args.amount.words[0]).to.equal(
        (0 * 100) / 100 + 100
      );
    });

    it("A deposits then B deposits then both withdraw", async () => {
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.words[0]).to.equal(
        (0 * 200) / 300 + 200
      );
      expect(balanceB.logs[0].args.amount.words[0]).to.equal(
        (0 * 100) / 300 + 100
      );
    });

    it("Team deposits then A deposits then B deposits then both withdraw", async () => {
      await ETHpoolInstance.depositRewards(300, { from: Team });
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.words[0]).to.equal(
        (0 * 200) / 300 + 200
      );
      expect(balanceB.logs[0].args.amount.words[0]).to.equal(
        (0 * 100) / 300 + 100
      );
    });

    it("A deposits then B deposits then A deposits then B deposits again the Team deposits then both withdraw", async () => {
      await ETHpoolInstance.depositToPool(300, { from: B });
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      await ETHpoolInstance.depositRewards(500, { from: Team });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.words[0]).to.equal(
        Math.floor((500 * 200) / 600 + 200)
      );
      expect(balanceB.logs[0].args.amount.words[0]).to.equal(
        Math.floor((500 * 400) / 600 + 400)
      );
    });
  });
});
