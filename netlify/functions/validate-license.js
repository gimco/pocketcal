function getAllowedOrigin(origin) {
	if (!origin) return null;
	if (origin.endsWith("pocketcal.com")) return origin;
	if (
		origin.startsWith("http://localhost") ||
		origin.startsWith("https://localhost")
	)
		return origin;
	return null;
}

exports.handler = async function (event) {
	const origin = event.headers.origin || event.headers.Origin;
	const allowedOrigin = getAllowedOrigin(origin);

	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			headers: allowedOrigin
				? {
						"Access-Control-Allow-Origin": allowedOrigin,
						"Access-Control-Allow-Headers": "Content-Type, Authorization",
				  }
				: {},
			body: "Method Not Allowed",
		};
	}

	// Handle preflight OPTIONS request
	if (event.httpMethod === "OPTIONS") {
		return {
			statusCode: 200,
			headers: allowedOrigin
				? {
						"Access-Control-Allow-Origin": allowedOrigin,
						"Access-Control-Allow-Headers": "Content-Type, Authorization",
						"Access-Control-Allow-Methods": "POST, OPTIONS",
				  }
				: {},
			body: "",
		};
	}

	try {
		const { licenseKey } = JSON.parse(event.body);
		if (!licenseKey) {
			return {
				statusCode: 200,
				headers: allowedOrigin
					? { "Access-Control-Allow-Origin": allowedOrigin }
					: {},
				body: JSON.stringify({ valid: false }),
			};
		}

		const response = await fetch(
			"https://api.lemonsqueezy.com/v1/licenses/validate",
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
				},
				body: JSON.stringify({
					license_key: licenseKey,
					product_id: process.env.LEMON_SQUEEZY_PRODUCT_ID,
				}),
			}
		);

		const data = await response.json();
		return {
			statusCode: 200,
			headers: allowedOrigin
				? { "Access-Control-Allow-Origin": allowedOrigin }
				: {},
			body: JSON.stringify({ valid: data.valid && data.status === "active" }),
		};
	} catch (error) {
		return {
			statusCode: 200,
			headers: allowedOrigin
				? { "Access-Control-Allow-Origin": allowedOrigin }
				: {},
			body: JSON.stringify({ valid: false }),
		};
	}
};
