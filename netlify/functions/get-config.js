// netlify/functions/get-config.js
// Returns the public Razorpay Key ID to the frontend.
// The Key ID is safe to expose — only the Key Secret must stay server-side.

exports.handler = async () => {
  const keyId = process.env.RAZORPAY_KEY_ID;

  if (!keyId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Razorpay Key ID is not configured.' }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key_id: keyId }),
  };
};
