// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./Vault.sol";

contract TicTacToe {
    enum State {
        Waiting,
        Player1Turn,
        Player2Turn,
        Player1Won,
        Player2Won,
        Draw
    }

    struct Game {
        uint id;
        address player1;
        address player2;
        State state;
        uint betAmount;
    }

    uint public gameCount;
    Vault vault;

    mapping(uint => Game) public games;
    mapping(uint => address[9]) public boards;

    event GameCreated(uint id, address player1, uint betAmount);
    event PlayerJoined(uint id, address player);
    event MoveMade(uint id, address player, uint8 position);
    event GameWon(uint id, address player);
    event GameDraw(uint id);

    constructor(address _vaultAddress) {
        vault = Vault(_vaultAddress);
    }

    function getBoard(uint id) public view returns (address[9] memory) {
        return boards[id];
    }

    function createGame(uint _betAmount) public returns (uint) {
        require(_betAmount > 0, "Bet amount must be greater than 0");
        require(
            _betAmount <= vault.getAvailableBalance(msg.sender),
            "Not enough balance"
        );
        vault.lock(msg.sender, _betAmount);

        uint id = gameCount++;
        games[id] = Game(id, msg.sender, address(0), State.Waiting, _betAmount);
        boards[id] = [
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0)
        ];

        emit GameCreated(id, msg.sender, _betAmount);

        return id;
    }

    function joinGame(uint id) public {
        require(
            games[id].betAmount <= vault.getAvailableBalance(msg.sender),
            "Not enough balance"
        );
        require(games[id].player1 != address(0), "Game does not exist");
        require(games[id].player2 == address(0), "Game is full");
        require(games[id].player1 != msg.sender, "Player already in");

        vault.lock(msg.sender, games[id].betAmount);

        games[id].player2 = msg.sender;
        games[id].state = State.Player2Turn;

        emit PlayerJoined(id, msg.sender);
    }

    function makeMove(uint id, uint8 position) public {
        require(games[id].player1 != address(0), "Game does not exist");
        require(
            games[id].state == State.Player1Turn ||
                games[id].state == State.Player2Turn,
            "Game is not active"
        );
        require(
            boards[id][position] == address(0),
            "Position is already taken"
        );
        require(
            (msg.sender == games[id].player1 &&
                games[id].state == State.Player1Turn) ||
                (msg.sender == games[id].player2 &&
                    games[id].state == State.Player2Turn),
            "Not your turn"
        );
        boards[id][position] = msg.sender;

        emit MoveMade(id, msg.sender, position);

        if (msg.sender == games[id].player1) {
            games[id].state = State.Player2Turn;
        } else {
            games[id].state = State.Player1Turn;
        }
        if (checkWin(boards[id])) {
            vault.unlock(games[id].player1, games[id].betAmount);
            vault.unlock(games[id].player2, games[id].betAmount);

            if (msg.sender == games[id].player1) {
                games[id].state = State.Player1Won;
                vault.move(games[id].player2, msg.sender, games[id].betAmount);
            } else {
                games[id].state = State.Player2Won;
                vault.move(games[id].player1, msg.sender, games[id].betAmount);
            }

            emit GameWon(id, msg.sender);
        } else if (checkDraw(boards[id])) {
            games[id].state = State.Draw;

            vault.unlock(games[id].player1, games[id].betAmount);
            vault.unlock(games[id].player2, games[id].betAmount);

            emit GameDraw(id);
        }
    }

    function checkWin(address[9] memory board) private pure returns (bool) {
        return
            (board[0] != address(0) &&
                board[0] == board[1] &&
                board[1] == board[2]) ||
            (board[3] != address(0) &&
                board[3] == board[4] &&
                board[4] == board[5]) ||
            (board[6] != address(0) &&
                board[6] == board[7] &&
                board[7] == board[8]) ||
            (board[0] != address(0) &&
                board[0] == board[3] &&
                board[3] == board[6]) ||
            (board[1] != address(0) &&
                board[1] == board[4] &&
                board[4] == board[7]) ||
            (board[2] != address(0) &&
                board[2] == board[5] &&
                board[5] == board[8]) ||
            (board[0] != address(0) &&
                board[0] == board[4] &&
                board[4] == board[8]) ||
            (board[2] != address(0) &&
                board[2] == board[4] &&
                board[4] == board[6]);
    }

    function checkDraw(address[9] memory board) private pure returns (bool) {
        for (uint8 i = 0; i < 9; i++) {
            if (board[i] == address(0)) {
                return false;
            }
        }
        return true;
    }
}
