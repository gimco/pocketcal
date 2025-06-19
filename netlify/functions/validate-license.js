const fetch = require("node-fetch");

exports.handler = async function (event) {
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Method Not Allowed" };
	}

	try {
		const { licenseKey } = JSON.parse(event.body);
		if (!licenseKey) {
			return { statusCode: 200, body: JSON.stringify({ valid: false }) };
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
			body: JSON.stringify({ valid: data.valid && data.status === "active" }),
		};
	} catch (error) {
		return {
			statusCode: 200,
			body: JSON.stringify({ valid: false }),
		};
	}
};
