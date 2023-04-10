import { ethers } from "hardhat";

async function main() {
  const Tic = await ethers.getContractFactory("Tic");
  const tic = await Tic.deploy();

  await tic.deployed();

  console.log(`Tic deployed to ${tic.address}`);

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(tic.address);

  await vault.deployed();

  console.log(`Vault deployed to ${vault.address}`);

  const TicTacToe = await ethers.getContractFactory("TicTacToe");
  const ticTacToe = await TicTacToe.deploy(vault.address);

  await ticTacToe.deployed();

  console.log(`TicTacToe deployed to ${ticTacToe.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
