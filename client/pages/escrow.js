import React, { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";
import Escrow from "../abi/Escrow.json";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { BigNumber, ethers, providers, utils } from "ethers";
import { escrowAddress } from "../.config";
import { parseUnits } from "ethers/lib/utils";

const escrow = () => {
	const [walletConnected, setWalletConnected] = useState(false);
	const [account, setAccount] = useState("");
	const [formInput, updateFormInput] = useState({
		price: "",
		name: "",
		email: "",
		description: "",
	});

	function getAccessToken() {
		return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
	}

	function makeStorageClient() {
		return new Web3Storage({ token: getAccessToken() });
	}

	function makeFileObjects() {
		const obj = formInput;
		const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

		const files = [
			new File(["contents-of-file-1"], "plain-utf8.txt"),
			new File([blob], "agreement.json"),
		];
		return files;
	}

	async function storeFiles() {
		await makeStorageClient();
		const files = await makeFileObjects();
		const client = makeStorageClient();
		const cid = await client.put(files);
		console.log("stored files with cid:", cid);
		updateFormInput({
			price: "",
			name: "",
			email: "",
			description: "",
		});
		return cid;
	}
	async function depositEscrow() {
		// console.log("new", formInput);
		const { price } = formInput;
		const web3Modal = new Web3Modal();
		console.log("web3Modal", web3Modal);
		const escrowPrice = parseUnits(price, "ether");
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		let contract = await new ethers.Contract(escrowAddress, Escrow.abi, signer);
		const trxHash = await contract.getHash(escrowPrice);
		// await transaction.wait();
		const transaction = await contract.createEscrow(trxHash, escrowPrice, {
			value: escrowPrice,
			// gas: 100000,
		});
		await transaction.wait();
		console.log("transact", transaction);
	}

	return (
		<div className="md:px-8 py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 flex justify-between">
				<h1 className="text-2xl font-semibold text-white">
					Create Escrow Agreement{" "}
				</h1>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"></div>
			</div>
			<div className="mr-auto w-52 px-4 mt-8 ">
				<div className="">
					<label htmlFor="email" className="block text-sm font-medium text-white">
						Email
					</label>
					<div className="mt-1">
						<input
							onChange={(e) =>
								updateFormInput({ ...formInput, email: e.target.value })
							}
							type="email"
							className="block px-3 w-full h-11 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="Name "
						/>
					</div>
				</div>
				<div className="">
					<label htmlFor="email" className="block text-sm font-medium text-white">
						Name
					</label>
					<div className="mt-1">
						<input
							onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
							type="text"
							className="block px-3 w-full h-11 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="Name "
						/>
					</div>
				</div>
				<div className="mt-4">
					<label htmlFor="email" className="block text-sm font-medium text-white">
						Price
					</label>
					<div className="mt-1">
						<input
							onChange={(e) =>
								updateFormInput({ ...formInput, price: e.target.value })
							}
							type="text"
							className="block px-3 w-full h-11 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="price in MATIC"
						/>
					</div>
				</div>
				<div className="mt-4">
					<label htmlFor="email" className="block text-sm font-medium text-white">
						Details
					</label>
					<div className="mt-1">
						<input
							onChange={(e) =>
								updateFormInput({ ...formInput, description: e.target.value })
							}
							type="text"
							className="block px-3 w-full h-11 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="Enter a few details"
						/>
					</div>
				</div>
				<div className="mt-4 ">
					<button
						onClick={storeFiles}
						type="submit"
						className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
};

export default escrow;
