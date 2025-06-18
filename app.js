const express = require("express");
const bodyParser = require("body-parser");
const admin = require("./firebase-config");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.post("/send-notification", async (req, res) => {
  const { registrationTokens, notification } = req.body;

  if (
    !registrationTokens ||
    !Array.isArray(registrationTokens) ||
    registrationTokens.length === 0 ||
    !notification ||
    !notification.title ||
    !notification.body
  ) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    tokens: registrationTokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Successfully sent message:", response);
    res.status(200).json({
      message: "Notifications sent successfully",
      response,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      error: "Failed to send notifications",
      details: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



// use the below format to hit the send-notification route using postman

{
  "registrationTokens": ["YOUR_FCM_TOKEN_HERE"],
  "notification": {
    "title": "Test Notification",
    "body": "This is a test message from Firebase"
  }
}