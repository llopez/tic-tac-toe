import { ethers } from "hardhat";

const TIC_ADDRESS = "0xc9da2738155F7566c34d2C5C0A3696baB124D670";

const mint = async () => {
  const tic = await ethers.getContractAt("Tic", TIC_ADDRESS);

  const [u1] = await ethers.getSigners();

  const mintAmount = ethers.utils.parseEther("100");

  // mint
  await tic.mint(u1.address, mintAmount);
};

mint();
