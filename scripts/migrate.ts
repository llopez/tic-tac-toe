import { ethers } from "hardhat";

const TIC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TIC_TAC_TOE_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const VAULT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const migrate = async () => {
  const tic = await ethers.getContractAt("Tic", TIC_ADDRESS);
  const ticTacToe = await ethers.getContractAt(
    "TicTacToe",
    TIC_TAC_TOE_ADDRESS
  );
  const vault = await ethers.getContractAt("Vault", VAULT_ADDRESS);

  const [u1, u2, u3] = await ethers.getSigners();

  const mintAmount = ethers.utils.parseEther("100");

  // mint
  await tic.mint(u1.address, mintAmount);
  await tic.mint(u2.address, mintAmount);
  await tic.mint(u3.address, mintAmount);

  const approveAmount = ethers.utils.parseEther("10");

  // approve
  await tic.connect(u1).approve(vault.address, approveAmount);
  await tic.connect(u2).approve(vault.address, approveAmount);
  await tic.connect(u3).approve(vault.address, approveAmount);

  // deposit
  await vault.connect(u1).deposit(approveAmount);
  await vault.connect(u2).deposit(approveAmount);
  await vault.connect(u3).deposit(approveAmount);

  const betAmount = ethers.utils.parseEther("1.5");

  // create game
  await ticTacToe.connect(u1).createGame(betAmount);
  await ticTacToe.connect(u2).createGame(betAmount);
  await ticTacToe.connect(u3).createGame(betAmount);
};

migrate();
