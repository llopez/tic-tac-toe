import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { Tic, Vault, TicTacToe } from "../typechain-types";

class TestHelper {
  public tic: Tic;
  public vault: Vault;
  public ticTacToe: TicTacToe;
  public mintAmount: BigNumber;
  public depositAmount: BigNumber;

  constructor(_tic: Tic, _vault: Vault, _ticTacToe: TicTacToe) {
    this.tic = _tic;
    this.vault = _vault;
    this.ticTacToe = _ticTacToe;
    this.mintAmount = ethers.utils.parseEther("100");
    this.depositAmount = ethers.utils.parseEther("5");
  }

  public async mintAndDeposit(_player: SignerWithAddress): Promise<void> {
    await this.tic.mint(_player.address, this.mintAmount);
    await this.tic
      .connect(_player)
      .approve(this.vault.address, this.depositAmount);
    await this.vault.connect(_player).deposit(this.depositAmount);
  }

  public async createGame(
    _player1: SignerWithAddress,
    _betAmount: BigNumber
  ): Promise<ContractTransaction> {
    return await this.ticTacToe.createGame(_betAmount);
  }
}

const deploy = async () => {
  const [owner, otherAccount] = await ethers.getSigners();

  const Tic = await ethers.getContractFactory("Tic");
  const tic = await Tic.deploy();

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(tic.address);

  const TicTacToe = await ethers.getContractFactory("TicTacToe");
  const ticTacToe = await TicTacToe.deploy(vault.address);

  return { tic, vault, ticTacToe, owner, otherAccount };
};

describe("TicTacToe", () => {
  describe("createGame", () => {
    it("creates a new game", async () => {
      const { tic, vault, ticTacToe, owner } = await loadFixture(deploy);

      const helper = new TestHelper(tic, vault, ticTacToe);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.mintAndDeposit(owner);

      expect(await vault.balanceOf(owner.address)).to.eq(helper.depositAmount);
      expect(await vault.getAvailableBalance(owner.address)).to.eq(
        helper.depositAmount
      );

      await expect(helper.createGame(owner, _betAmount))
        .to.emit(ticTacToe, "GameCreated")
        .withArgs(0, owner.address, _betAmount);

      expect(await vault.getAvailableBalance(owner.address)).to.eq(
        helper.depositAmount.sub(_betAmount)
      );

      const [id, player1, player2, state] = await ticTacToe.games(0);

      expect(id).to.eq(0);
      expect(player1).to.eq(owner.address);
      expect(player2).to.eq(ethers.constants.AddressZero);
      expect(state).to.eq(0);

      expect(await ticTacToe.boards(0, 0)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 1)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 2)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 3)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 4)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 5)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 6)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 7)).to.eq(ethers.constants.AddressZero);
      expect(await ticTacToe.boards(0, 8)).to.eq(ethers.constants.AddressZero);
    });
  });

  describe("joinGame", () => {
    it("joins a game", async () => {
      const { tic, vault, ticTacToe, owner, otherAccount } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);

      await helper.mintAndDeposit(owner);
      await helper.mintAndDeposit(otherAccount);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.createGame(owner, _betAmount);

      await expect(ticTacToe.connect(otherAccount).joinGame(0))
        .to.emit(ticTacToe, "PlayerJoined")
        .withArgs(0, otherAccount.address);

      const [id, player1, player2, state] = await ticTacToe.games(0);

      expect(id).to.eq(0);
      expect(player1).to.eq(owner.address);
      expect(player2).to.eq(otherAccount.address);
      expect(state).to.eq(2);
    });

    it("fails if the game does not exist", async () => {
      const { ticTacToe, otherAccount } = await loadFixture(deploy);

      await expect(
        ticTacToe.connect(otherAccount).joinGame(0)
      ).to.be.revertedWith("Game does not exist");
    });

    it("fails if the game is already full", async () => {
      const { vault, tic, owner, ticTacToe, otherAccount } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);
      await helper.mintAndDeposit(owner);
      await helper.mintAndDeposit(otherAccount);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.createGame(owner, _betAmount);
      await ticTacToe.connect(otherAccount).joinGame(0);

      await expect(
        ticTacToe.connect(otherAccount).joinGame(0)
      ).to.be.revertedWith("Game is full");
    });

    it("fails if the player is already in the game", async () => {
      const { vault, owner, tic, ticTacToe } = await loadFixture(deploy);

      const helper = new TestHelper(tic, vault, ticTacToe);

      await helper.mintAndDeposit(owner);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.createGame(owner, _betAmount);
      await expect(ticTacToe.joinGame(0)).to.be.revertedWith(
        "Player already in"
      );
    });
  });

  describe("makeMove", () => {
    it("makes a move", async () => {
      const { tic, vault, ticTacToe, owner, otherAccount } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);

      await helper.mintAndDeposit(owner);
      await helper.mintAndDeposit(otherAccount);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.createGame(owner, _betAmount);
      await ticTacToe.connect(otherAccount).joinGame(0);

      await expect(ticTacToe.connect(otherAccount).makeMove(0, 0))
        .to.emit(ticTacToe, "MoveMade")
        .withArgs(0, otherAccount.address, 0);

      const [id, player1, player2, state] = await ticTacToe.games(0);

      expect(id).to.eq(0);
      expect(player1).to.eq(owner.address);
      expect(player2).to.eq(otherAccount.address);
      expect(state).to.eq(1);

      expect(await ticTacToe.boards(0, 0)).to.eq(otherAccount.address);
    });

    it("ends the game if there is a winner", async () => {
      const { tic, vault, ticTacToe, owner, otherAccount } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);
      await helper.mintAndDeposit(owner);
      await helper.mintAndDeposit(otherAccount);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.createGame(owner, _betAmount);
      await ticTacToe.connect(otherAccount).joinGame(0);

      /*
      0 1 2
      3 4 5
      6 7 8
      */

      await ticTacToe.connect(otherAccount).makeMove(0, 0);
      await ticTacToe.makeMove(0, 3);
      await ticTacToe.connect(otherAccount).makeMove(0, 1);
      await ticTacToe.makeMove(0, 4);

      // check events have been emitted
      await expect(ticTacToe.connect(otherAccount).makeMove(0, 2))
        .to.emit(ticTacToe, "GameWon")
        .withArgs(0, otherAccount.address)
        .and.emit(ticTacToe, "GameWon")
        .withArgs(0, otherAccount.address);

      const [, , , state] = await ticTacToe.games(0);

      // check that the game has ended
      expect(state).to.eq(4);

      // check that the winner has been paid
      expect(await vault.getAvailableBalance(otherAccount.address)).to.eq(
        helper.depositAmount.add(_betAmount)
      );

      // check that the loser has been paid
      expect(await vault.getAvailableBalance(owner.address)).to.eq(
        helper.depositAmount.sub(_betAmount)
      );
    });

    it("ends the game if there is a draw", async () => {
      const { ticTacToe, owner, otherAccount, tic, vault } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.mintAndDeposit(owner);
      await helper.mintAndDeposit(otherAccount);

      await helper.createGame(owner, _betAmount);
      await ticTacToe.connect(otherAccount).joinGame(0);

      await ticTacToe.connect(otherAccount).makeMove(0, 2);
      await ticTacToe.makeMove(0, 0);
      await ticTacToe.connect(otherAccount).makeMove(0, 3);
      await ticTacToe.makeMove(0, 1);
      await ticTacToe.connect(otherAccount).makeMove(0, 4);
      await ticTacToe.makeMove(0, 5);
      await ticTacToe.connect(otherAccount).makeMove(0, 7);
      await ticTacToe.makeMove(0, 6);

      await expect(ticTacToe.connect(otherAccount).makeMove(0, 8))
        .to.emit(ticTacToe, "GameDraw")
        .withArgs(0);

      const [, , , state] = await ticTacToe.games(0);

      expect(state).to.eq(5);
    });

    it("fails if the game does not exist", async () => {
      const { ticTacToe, otherAccount } = await loadFixture(deploy);

      await expect(
        ticTacToe.connect(otherAccount).makeMove(0, 0)
      ).to.be.revertedWith("Game does not exist");
    });

    it("fails if the game is not in active", async () => {
      const { ticTacToe, otherAccount, tic, vault, owner } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);

      await helper.mintAndDeposit(owner);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.createGame(owner, _betAmount);

      await expect(
        ticTacToe.connect(otherAccount).makeMove(0, 0)
      ).to.be.revertedWith("Game is not active");
    });

    it("fails if position is already taken", async () => {
      const { ticTacToe, otherAccount, owner, tic, vault } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.mintAndDeposit(owner);
      await helper.mintAndDeposit(otherAccount);

      await helper.createGame(owner, _betAmount);
      await ticTacToe.connect(otherAccount).joinGame(0);
      await ticTacToe.connect(otherAccount).makeMove(0, 0);

      await expect(ticTacToe.makeMove(0, 0)).to.be.revertedWith(
        "Position is already taken"
      );
    });

    it("fails if it is not the player's turn", async () => {
      const { ticTacToe, otherAccount, tic, vault, owner } = await loadFixture(
        deploy
      );

      const helper = new TestHelper(tic, vault, ticTacToe);

      const _betAmount = ethers.utils.parseEther("1.5");

      await helper.mintAndDeposit(owner);
      await helper.mintAndDeposit(otherAccount);

      await helper.createGame(owner, _betAmount);
      await ticTacToe.connect(otherAccount).joinGame(0);

      await expect(ticTacToe.makeMove(0, 0)).to.be.revertedWith(
        "Not your turn"
      );
    });
  });
});
