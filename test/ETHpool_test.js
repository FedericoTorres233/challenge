const ETHpool = artifacts.require("ETHpool");
const expect = require("chai").expect;

function withdrawn(reward, deposited, pool_) {
  return (reward * deposited) / pool_ + deposited;
}

contract("ETHpool", (account) => {
  [Team, A, B, C] = account;
  console.log(A, B, C, Team);

  let ETHpoolInstance;
  beforeEach(async () => {
    ETHpoolInstance = await ETHpool.new({ from: Team });
  });

  // Address owner has to be public to test the following function:
  /*
  context("Constructor", async () => {
    it("Owner must be Team", async () => {
      const owner = await ETHpoolInstance.owner();
      expect(owner).to.equal(Team);
    });
  });*/

  context("Execution", async () => {
    it("A deposits then B deposits then Team deposits then both withdraw", async () => {
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      await ETHpoolInstance.depositRewards(300, { from: Team });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(300, 200, 300)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(300, 100, 300)
      );
    });

    it("A deposits then Team deposits then B deposits then both withdraw", async () => {
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositRewards(300, { from: Team });
      await ETHpoolInstance.depositToPool(100, { from: B });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(300, 200, 200)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(0, 100, 100)
      );
    });

    it("A deposits then B deposits then both withdraw", async () => {
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(0, 200, 300)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(0, 100, 300)
      );
    });

    it("Team deposits then A deposits then B deposits then both withdraw", async () => {
      await ETHpoolInstance.depositRewards(300, { from: Team });
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(0, 200, 300)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(0, 100, 300)
      );
    });

    it(`A deposits then B deposits then A deposits then B deposits
    again the Team deposits then both withdraw`, async () => {
      await ETHpoolInstance.depositToPool(300, { from: B });
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      await ETHpoolInstance.depositRewards(500, { from: Team });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(500, 200, 600)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(500, 400, 600)
      );
    });

    it(`A deposits then B deposits then A deposits then B deposits
    then C deposits 2 times again the Team deposits then both
    withdraw`, async () => {
      await ETHpoolInstance.depositToPool(300, { from: B });
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(100, { from: B });
      await ETHpoolInstance.depositToPool(700, { from: C });
      await ETHpoolInstance.depositToPool(50, { from: C });
      await ETHpoolInstance.depositRewards(500, { from: Team });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      const balanceC = await ETHpoolInstance.withdrawFunds({ from: C });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(500, 200, 1350)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(500, 400, 1350)
      );
      expect(balanceC.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(500, 750, 1350)
      );
    });

    it(` RANDOM NUMBERS: A deposits then B deposits then A
    deposits then B deposits then C deposits 2 times again
    the Team deposits then both withdraw`, async () => {
      const depositA = Math.trunc(Math.random() * 1000);
      const depositB1 = Math.trunc(Math.random() * 1000);
      const depositB2 = Math.trunc(Math.random() * 1000);
      const depositC1 = Math.trunc(Math.random() * 1000);
      const depositC2 = Math.trunc(Math.random() * 1000);
      const depositT = Math.trunc(Math.random() * 1000);
      console.log(depositA, depositB1, depositC1, depositB2, depositC2);
      const pool = depositA + depositB1 + depositC1 + depositB2 + depositC2;
      await ETHpoolInstance.depositToPool(depositB1, { from: B });
      await ETHpoolInstance.depositToPool(depositA, { from: A });
      await ETHpoolInstance.depositToPool(depositB2, { from: B });
      await ETHpoolInstance.depositToPool(depositC1, { from: C });
      await ETHpoolInstance.depositToPool(depositC2, { from: C });
      await ETHpoolInstance.depositRewards(depositT, { from: Team });
      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      const balanceC = await ETHpoolInstance.withdrawFunds({ from: C });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(depositT, depositA, pool)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(depositT, depositB1 + depositB2, pool)
      );
      expect(balanceC.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(depositT, depositC1 + depositC2, pool)
      );
    });

    it(`Team deposits two times but withdraw at the end`, async () => {
      await ETHpoolInstance.depositToPool(300, { from: B });
      await ETHpoolInstance.depositToPool(200, { from: A });
      await ETHpoolInstance.depositToPool(190, { from: B });
      await ETHpoolInstance.depositRewards(503, { from: Team });
      await ETHpoolInstance.depositToPool(100, { from: B });
      await ETHpoolInstance.depositToPool(700, { from: C });
      await ETHpoolInstance.depositToPool(54, { from: B });
      await ETHpoolInstance.depositToPool(1000, { from: A });
      await ETHpoolInstance.depositToPool(900, { from: A });
      await ETHpoolInstance.depositRewards(870, { from: Team });
      await ETHpoolInstance.depositToPool(71, { from: C });

      const balanceA = await ETHpoolInstance.withdrawFunds({ from: A });
      const balanceB = await ETHpoolInstance.withdrawFunds({ from: B });
      const balanceC = await ETHpoolInstance.withdrawFunds({ from: C });
      expect(balanceA.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(503, 200, 690) +
          withdrawn(870, 1900, 2754) +
          withdrawn(0, 0, 71)
      );
      expect(balanceB.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(503, 490, 690) +
          withdrawn(870, 154, 2754) +
          withdrawn(0, 0, 71)
      );
      expect(balanceC.logs[0].args.amount.toNumber()).to.equal(
        withdrawn(503, 0, 690) +
          withdrawn(870, 700, 2754) +
          withdrawn(0, 71, 71)
      );
    });
  });
});
