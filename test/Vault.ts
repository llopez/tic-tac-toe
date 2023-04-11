import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const deploy = async () => {
  const [owner, otherAccount] = await ethers.getSigners();

  const Tic = await ethers.getContractFactory("Tic");
  const tic = await Tic.deploy();

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(tic.address);

  return { tic, vault, owner, otherAccount };
};

describe("Vault", () => {
  describe("deposit", () => {
    it("should deposit", async () => {
      const { vault, tic, owner } = await loadFixture(deploy);
      const amount = ethers.utils.parseEther("10");
      const mintAmount = ethers.utils.parseEther("100");

      await tic.connect(owner).mint(owner.address, mintAmount);
      await tic.connect(owner).approve(vault.address, amount);
      await vault.connect(owner).deposit(amount);

      expect(await vault.balanceOf(owner.address)).to.equal(amount);
      expect(await tic.balanceOf(owner.address)).to.equal(
        mintAmount.sub(amount)
      );
    });
  });

  describe("withdraw", () => {
    it("should withdraw", async () => {
      const { vault, tic, owner, otherAccount } = await loadFixture(deploy);
      const amount = ethers.utils.parseEther("10");
      const mintAmount = ethers.utils.parseEther("100");
      const withdrawAmount = ethers.utils.parseEther("5");

      await tic.connect(owner).mint(otherAccount.address, mintAmount);
      await tic.connect(otherAccount).approve(vault.address, amount);
      await vault.connect(otherAccount).deposit(amount);

      await vault.connect(otherAccount).withdraw(withdrawAmount);

      expect(await vault.balanceOf(otherAccount.address)).to.equal(
        amount.sub(withdrawAmount)
      );
      expect(await tic.balanceOf(otherAccount.address)).to.equal(
        ethers.utils.parseEther("95")
      );
    });
  });
});
