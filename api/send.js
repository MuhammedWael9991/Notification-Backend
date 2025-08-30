const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: "Missing token/title/body" });
  }

  try {
    const message = {
      notification: { title, body },
      token: token,
    };

    await admin.messaging().send(message);
    res.json({ success: true, message: "Notification sent ✅" });
  } catch (error) {
    console.error("FCM Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};