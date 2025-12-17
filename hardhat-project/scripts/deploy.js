const hre = require("hardhat");

async function main() {
  const ArtNFT = await hre.ethers.getContractFactory("ArtNFT");

  console.log(" Deploying ArtNFT...");
  const artNFT = await ArtNFT.deploy();

  await artNFT.waitForDeployment();

  console.log("ArtNFT deployed to:", artNFT.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
