require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY;
const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: "0.8.4",
	networks: {
		mumbai: {
			url: ALCHEMY_API_KEY_URL,
			accounts: [MUMBAI_PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			polygonMumbai: POLYGONSCAN_KEY,
		},
	},
};
