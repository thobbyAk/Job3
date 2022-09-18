import { Web3Storage } from "web3.storage";
import { useState, useEffect } from "react";
import Link from "next/link";

const stats = [
	{ name: "Total Subscribers", stat: "71,897" },
	{ name: "Open Escrows", stat: "58.16%" },
	{ name: "Executed escrows", stat: "24.57%" },
];
const people = [
	{
		name: "Test Agreement",
		title: "Front-end Developer",
		department: "Optimization",
		email: "job3test@example.com",
		role: "1.0 Matic",
		image:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	// More people...
];

export default function Home() {
	const [agreements, setAgreements] = useState([]);

	function getAccessToken() {
		return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
	}

	function makeStorageClient() {
		return new Web3Storage({ token: getAccessToken() });
	}

	async function listUploads() {
		const client = makeStorageClient();
		console.log("list", client.list());
		for await (const upload of client.list()) {
			console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`);
			const agree = {
				name: upload.name,
				cid: upload.cid,
			};
		}
	}
	useEffect(() => {
		listUploads();
	}, []);

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 flex justify-between">
				<h1 className="text-2xl font-semibold text-white">Dashboard</h1>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<Link href={`/escrow`} passHref>
						<button
							type="button"
							className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
						>
							Create Escrow Agreement
						</button>
					</Link>
				</div>
			</div>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<div>
					{/* <h3 className="text-lg font-medium leading-6 text-gray-900">
						Last 30 days
					</h3> */}
					<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
						{stats.map((item) => (
							<div
								key={item.name}
								className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
							>
								<dt className="truncate text-sm font-medium text-gray-500">
									{item.name}
								</dt>
								<dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
									{item.stat}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
			<div className="mx-auto max-w-7xl px-4 ">
				<div className="sm:flex sm:items-center mt-8">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-white">Recent Agreement</h1>
					</div>
					<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"></div>
				</div>
				<div className="mt-2 flex flex-col">
					<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
								<table className="min-w-full divide-y divide-gray-300">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
											>
												Name
											</th>
											<th
												scope="col"
												className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
											>
												Title
											</th>
											<th
												scope="col"
												className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
											>
												Status
											</th>
											<th
												scope="col"
												className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
											>
												Price
											</th>
											{/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
												<span className="sr-only">Edit</span>
											</th> */}
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{people.map((person) => (
											<tr key={person.email}>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
													<div className="flex items-center">
														<div className="h-10 w-10 flex-shrink-0">
															<img
																className="h-10 w-10 rounded-full"
																src={person.image}
																alt=""
															/>
														</div>
														<div className="ml-4">
															<div className="font-medium text-gray-900">{person.name}</div>
															<div className="text-gray-500">{person.email}</div>
														</div>
													</div>
												</td>
												<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
													<div className="text-gray-900">{person.title}</div>
													<div className="text-gray-500">{person.department}</div>
												</td>
												<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
													<span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
														Active
													</span>
												</td>
												<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
													{person.role}
												</td>
												{/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													<a href="#" className="text-indigo-600 hover:text-indigo-900">
														Edit<span className="sr-only">, {person.name}</span>
													</a>
												</td> */}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
