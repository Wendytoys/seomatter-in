import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { proof, ...otherParams } = await req.json();
	const app_id = process.env.WLD_APP_ID;
	const client_secret = process.env.WLD_CLIENT_SECRET;

	if (!app_id || !client_secret) {
		return NextResponse.json(
			{ error: "Missing Worldcoin environment variables." },
			{ status: 500 }
		);
	}

	const verifyRes = await fetch(
		`https://developer.worldcoin.org/api/v1/verify/${app_id}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...proof, client_secret, ...otherParams }),
		}
	);

	const wldResponse = await verifyRes.json();

	if (verifyRes.status === 200) {
		// This is the user's nullifier, unique to your app
		const nullifier_hash = wldResponse.nullifier_hash;
		console.log("Verification successful, nullifier:", nullifier_hash);
		return NextResponse.json({ success: true, nullifier_hash }, { status: 200 });
	} else {
		// Handle errors from Worldcoin API
		console.error("Verification failed:", wldResponse);
		return NextResponse.json({ success: false, error: wldResponse }, { status: 400 });
	}
}
