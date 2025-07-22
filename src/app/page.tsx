"use client";

import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useVerification } from "./context/VerificationContext";
import { useRouter } from "next/navigation";

export default function Home() {
	const { verified, setVerified } = useVerification();
	const [isVerifying, setIsVerifying] = useState(false);
	const router = useRouter();
	const action = "verify-user";
	const appId = process.env.NEXT_PUBLIC_WLD_APP_ID;

	const handleVerify = async (proof: ISuccessResult) => {
		const res = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...proof, action }),
		});
		
		if (!res.ok) {
			const error = await res.json();
			console.error("Verification failed:", error);
			setIsVerifying(false);
			// Optionally, show an error message to the user
			return;
		}

		const { success } = await res.json();
		if (success) {
			setVerified(true);
		} else {
			setIsVerifying(false);
		}
	};

	const onSuccess = () => {
		setIsVerifying(true);
	};

	// GSAP Animations
	const containerRef = useRef(null);
	const headerRef = useRef(null);
	const cardRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
		gsap.fromTo(cardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 });
	}, []);

	useEffect(() => {
		if (verified) {
			// Animate out and then redirect
			gsap.to(cardRef.current, { 
				opacity: 0, 
				y: -50, 
				duration: 0.5, 
				ease: "power3.in",
				onComplete: () => router.push('/dashboard')
			});
		}
	}, [verified, router]);


	return (
		<div ref={containerRef} className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
			<header ref={headerRef} className="absolute top-0 left-0 w-full p-4">
				<h1 className="text-2xl font-bold text-center">SEOMatter.in</h1>
			</header>

			<main className="flex items-center justify-center w-full flex-1">
				<div ref={cardRef} className="w-full max-w-md p-8 space-y-6 rounded-2xl glass-card">
					{isVerifying ? (
						<div className="text-center">
							<div className="w-16 h-16 mx-auto border-4 border-dashed rounded-full animate-spin border-white"></div>
							<h2 className="mt-4 text-3xl font-bold">Verifying...</h2>
							<p className="mt-2 text-gray-300">Please wait while we confirm your proof.</p>
						</div>
					) : (
						<>
							<div className="text-center">
								<h2 className="text-3xl font-bold">Verify Your Humanity</h2>
								<p className="mt-2 text-gray-300">Access exclusive tools by proving you&apos;re a unique human, not a bot.</p>
							</div>
							{appId ? (
								<IDKitWidget
									app_id={appId as `app_${string}`}
									action={action}
									onSuccess={onSuccess}
									handleVerify={handleVerify}
								>
									{({ open }) => (
										<button
											className="w-full px-4 py-3 font-bold text-black bg-white rounded-lg hover:bg-gray-200 transition-colors duration-300"
											onClick={open}
										>
											Verify with World ID
										</button>
									)}
								</IDKitWidget>
							) : (
								<div className="p-4 text-center text-red-400 bg-red-900/50 rounded-md">
									<p>App ID is not configured.</p>
									<p className="text-xs">Please set NEXT_PUBLIC_WLD_APP_ID in your environment variables.</p>
								</div>
							)}
						</>
					)}
				</div>
			</main>

			<footer className="absolute bottom-0 left-0 w-full p-4 text-center text-gray-500">
				<p>Powered by Worldcoin</p>
			</footer>
		</div>
	);
}