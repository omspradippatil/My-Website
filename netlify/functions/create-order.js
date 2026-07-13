// netlify/functions/create-order.js
// Netlify serverless function — creates a Razorpay order on the backend.
// The KEY_SECRET never leaves the server.

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const amountInPaise = Math.round(Number(body.amount) * 100);

  // Validate amount — Razorpay minimum is 100 paise (₹1)
  if (!amountInPaise || amountInPaise < 100) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Amount must be at least ₹1 (100 paise)." }),
    };
  }

  // Cap at ₹1,00,000 to prevent abuse
  if (amountInPaise > 10000000) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Amount exceeds maximum limit of ₹1,00,000." }),
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      }),
    };
  } catch (err) {
    console.error("Razorpay create-order error:", err);

    // Auth failure (bad credentials)
    if (err.statusCode === 401) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Payment gateway authentication failed." }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create order. Please try again." }),
    };
  }
};
