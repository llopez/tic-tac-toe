import { ethers } from "hardhat";

async function main() {
  const TicTacToe = await ethers.getContractFactory("TicTacToe");
  const ticTacToe = await TicTacToe.deploy();

  await ticTacToe.deployed();

  console.log(`TicTacToe deployed to ${ticTacToe.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
