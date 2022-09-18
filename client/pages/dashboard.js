import React from "react";
const stats = [
	{ name: "Total Subscribers", stat: "71,897" },
	{ name: "Open Escrows", stat: "58.16%" },
	{ name: "Executed escrows", stat: "24.57%" },
];

const dashboard = () => {
	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<h1 className="text-2xl font-semibold text-gray-900">Dgggashboard</h1>
			</div>
			<div>
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Last 30 days
				</h3>
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
	);
};

export default dashboard;
