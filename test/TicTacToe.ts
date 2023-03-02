import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TicTacToe", () => {
  const deploy = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const TicTacToe = await ethers.getContractFactory("TicTacToe");
    const ticTacToe = await TicTacToe.deploy();

    return { ticTacToe, owner, otherAccount };
  };

  describe("createGame", () => {
    it("creates a new game", async () => {
      const { ticTacToe, owner } = await loadFixture(deploy);

      await expect(ticTacToe.createGame())
        .to.emit(ticTacToe, "GameCreated")
        .withArgs(0, owner.address);

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
      const { ticTacToe, owner, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();

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
      const { ticTacToe, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();
      await ticTacToe.connect(otherAccount).joinGame(0);

      await expect(
        ticTacToe.connect(otherAccount).joinGame(0)
      ).to.be.revertedWith("Game is full");
    });
  });

  describe("makeMove", () => {
    it("makes a move", async () => {
      const { ticTacToe, owner, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();
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
      const { ticTacToe, owner, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();
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

      await expect(ticTacToe.connect(otherAccount).makeMove(0, 2))
        .to.emit(ticTacToe, "GameWon")
        .withArgs(0, otherAccount.address);

      const [, , , state] = await ticTacToe.games(0);

      expect(state).to.eq(4);
    });

    it("ends the game if there is a draw", async () => {
      const { ticTacToe, owner, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();
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
      const { ticTacToe, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();

      await expect(
        ticTacToe.connect(otherAccount).makeMove(0, 0)
      ).to.be.revertedWith("Game is not active");
    });

    it("fails if position is already taken", async () => {
      const { ticTacToe, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();
      await ticTacToe.connect(otherAccount).joinGame(0);
      await ticTacToe.connect(otherAccount).makeMove(0, 0);

      await expect(ticTacToe.makeMove(0, 0)).to.be.revertedWith(
        "Position is already taken"
      );
    });

    it("fails if it is not the player's turn", async () => {
      const { ticTacToe, otherAccount } = await loadFixture(deploy);

      await ticTacToe.createGame();
      await ticTacToe.connect(otherAccount).joinGame(0);

      await expect(ticTacToe.makeMove(0, 0)).to.be.revertedWith(
        "Not your turn"
      );
    });
  });
});
