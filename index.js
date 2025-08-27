const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-key.json"); // حط ملف السيرفس اكاونت هنا

// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json()); // عشان يقرأ JSON body

// test route
app.get("/", (req, res) => {
  res.send("🚀 Notification service is running");
});

// send notification
app.post("/send", async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Received body:", req.body);

  const { token, title, body } = req.body;
  console.log("Body type:", typeof req.body);
  console.log("Body keys:", Object.keys(req.body));

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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

