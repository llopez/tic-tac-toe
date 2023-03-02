// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

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
    }

    uint public gameCount;

    mapping(uint => Game) public games;
    mapping(uint => address[9]) public boards;

    event GameCreated(uint id, address player1);
    event PlayerJoined(uint id, address player);
    event MoveMade(uint id, address player, uint8 position);
    event GameWon(uint id, address player);
    event GameDraw(uint id);

    function createGame() public returns (uint) {
        uint id = gameCount++;
        games[id] = Game(id, msg.sender, address(0), State.Waiting);
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

        emit GameCreated(id, msg.sender);

        return id;
    }

    function joinGame(uint id) public {
        require(games[id].player1 != address(0), "Game does not exist");
        require(games[id].player2 == address(0), "Game is full");
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
            if (msg.sender == games[id].player1) {
                games[id].state = State.Player1Won;
            } else {
                games[id].state = State.Player2Won;
            }
            emit GameWon(id, msg.sender);
        } else if (checkDraw(boards[id])) {
            games[id].state = State.Draw;
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
