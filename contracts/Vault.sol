// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Vault {
    IERC20 token;

    mapping(address => uint) public balanceOf;
    mapping(address => uint) public lockedBalanceOf;
    uint public totalBalance;

    event Deposit(uint amount, address user);
    event Withdraw(uint amount, address user);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function getAvailableBalance(address user) public view returns (uint) {
        return balanceOf[user] - lockedBalanceOf[user];
    }

    function lock(address user, uint _amount) public {
        uint availableBalance = getAvailableBalance(user);

        require(_amount <= availableBalance, "not enough balance");

        lockedBalanceOf[user] += _amount;
    }

    function unlock(address user, uint _amount) public {
        require(_amount <= lockedBalanceOf[user], "not enough locked balance");

        lockedBalanceOf[user] -= _amount;
    }

    function move(address from, address to, uint _amount) public {
        require(_amount <= balanceOf[from], "not enough balance");

        balanceOf[from] -= _amount;
        balanceOf[to] += _amount;
    }

    function deposit(uint _amount) public {
        require(
            _amount <= token.allowance(msg.sender, address(this)),
            "not enough allowance"
        );

        token.transferFrom(msg.sender, address(this), _amount);

        balanceOf[msg.sender] += _amount;
        totalBalance += _amount;

        emit Deposit(_amount, msg.sender);
    }

    function withdraw(uint _amount) public {
        require(_amount <= balanceOf[msg.sender], "not enough balance");

        token.transfer(msg.sender, _amount);

        balanceOf[msg.sender] -= _amount;
        totalBalance -= _amount;

        emit Withdraw(_amount, msg.sender);
    }
}
