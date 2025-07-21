"use client";

import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";

export default function Home() {
	const [verified, setVerified] = useState(false);

	const handleVerify = async (proof: ISuccessResult) => {
		const res = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(proof),
		});
		if (!res.ok) {
			throw new Error("Verification failed.");
		}
		const { success } = await res.json();
		if (success) {
			setVerified(true);
		}
	};

	const onSuccess = () => {
		// This is where you'll handle the successful verification
		// For example, you can redirect the user to a new page
		window.alert("Successfully verified!");
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8">
			<main className="flex flex-col items-center gap-8">
				<h1 className="text-2xl font-bold">Worldcoin Mini App</h1>
				<p>Verify your identity to continue.</p>
				{!verified && (
					<IDKitWidget
						app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!}
						action="verify-action" // <-- TODO: Replace with your Action ID
						onSuccess={onSuccess}
						handleVerify={handleVerify}
					>
						{({ open }) => (
							<button
								className="px-4 py-2 font-medium text-white bg-black rounded-md"
								onClick={open}
							>
								Verify with World ID
							</button>
						)}
					</IDKitWidget>
				)}
				{verified && (
					<div className="p-4 text-green-700 bg-green-100 border border-green-400 rounded-md">
						<p>You are successfully verified!</p>
					</div>
				)}
			</main>
		</div>
	);
}
