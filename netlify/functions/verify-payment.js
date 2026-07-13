// netlify/functions/verify-payment.js
// Netlify serverless function — verifies the Razorpay payment signature.
// Uses HMAC-SHA256 with KEY_SECRET (never exposed to frontend).

const crypto = require("crypto");

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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  // Validate all required fields are present
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required payment verification fields.",
      }),
    };
  }

  // Generate expected signature using HMAC-SHA256
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  const sigBuffer = Buffer.from(generatedSignature, "hex");
  const recvBuffer = Buffer.from(razorpay_signature, "hex");

  let isValid = false;
  if (sigBuffer.length === recvBuffer.length) {
    isValid = crypto.timingSafeEqual(sigBuffer, recvBuffer);
  }

  if (isValid) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Payment verified successfully!",
        payment_id: razorpay_payment_id,
      }),
    };
  } else {
    // Signature mismatch — do NOT mark as paid
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Payment signature verification failed.",
      }),
    };
  }
};
