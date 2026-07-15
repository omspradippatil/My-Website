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

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      key_id: keyId,
      firebaseConfig: firebaseConfig
    }),
  };
};
