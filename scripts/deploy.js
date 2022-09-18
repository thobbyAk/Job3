// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

//matic address on mumbai
const erc20Matic = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0";
async function main() {
	// const [deployer] = await ethers.getSigners();

	// // We get the contract to deploy
	// // We get the  ERC20 contract to deploy
	// const ERC20 = await hre.ethers.getContractFactory("MockMaticToken");
	// const erc20 = await ERC20.deploy();
	// await erc20.deployed();

	// We get the escrow contract to deploy
	const Escrow = await hre.ethers.getContractFactory("Escrow");
	const escrow = await Escrow.deploy(erc20Matic);
	await escrow.deployed();

	await sleep(100000);

	// // Verify the contract after deploying
	// await hre.run("verify:verify", {
	// 	address: erc20.address,
	// 	constructorArguments: [],
	// });

	// Verify the contract after deploying
	await hre.run("verify:verify", {
		address: escrow.address,
		constructorArguments: [erc20Matic],
	});
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
