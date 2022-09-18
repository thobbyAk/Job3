const { expect } = require("chai");

describe("Escrow", function () {
	let contract;
	let erc20;
	const amount = ethers.utils.parseUnits("10.0");
	let deployer;
	let account1;
	let account2;
	let zeroaccount = "0x0000000000000000000000000000000000000000 ";
	before(async function () {
		const ERC20Contract = await ethers.getContractFactory("MockMaticToken");
		erc20 = await ERC20Contract.deploy();
		await erc20.deployed();

		const accounts = await hre.ethers.getSigners();
		deployer = accounts[0];
		account1 = accounts[1];
		account2 = accounts[2];

		const transferTx = await erc20.transfer(
			account1.address,
			"80000000000000000000"
		);
		await transferTx.wait();

		const EscrowContract = await ethers.getContractFactory("Escrow");
		contract = await EscrowContract.deploy(erc20.address);
		await contract.deployed();

		const erc20WithSigner = erc20.connect(account1);
		const approveTx = await erc20WithSigner.approve(
			contract.address,
			"90000000000000000000"
		);
		await approveTx.wait();
	});
	it("account1: createEscrow", async function () {
		const contractWithSigner = contract.connect(account1);
		const trxHash = await contract.getHash(amount);
		const createEscrowTx = await contractWithSigner.createEscrow(trxHash, amount);
		await createEscrowTx.wait();
		expect((await erc20.balanceOf(account1.address)).toString()).to.equal(
			"70000000000000000000"
		);
	});
	it("should fetch created escrows", async function () {
		const contractWithSigner = contract.connect(account1);
		const trxHash = await contract.getHash(amount);
		const createEscrowTx = await contractWithSigner.createEscrow(trxHash, amount);
		await createEscrowTx.wait();

		let escrows = await contract.fetchEscrows();
		escrows = await Promise.all(
			escrows.map(async (i) => {
				let escrow = {
					escrowId: i.escrowId,
					creator: i.creator,
					amount: i.amount.toString(),
					txnHash: i.txnHash,
					clamimer: i.claimer,
				};
				return escrow;
			})
		);
		console.log("all escrows,", escrows);
		// await expect(contract.createEscrow(trxHash, amount))
		// 	.to.emit(contract, "EscrowItemCreated")
		// 	.withArgs(1, trxHash, account1.address, zeroaccount, amount, false);
	});
});
