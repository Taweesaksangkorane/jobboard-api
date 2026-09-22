require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

app.post(
  "/api/webhooks/jobboard",
  (req, res) => {
    const secret =
      req.headers["x-webhook-secret"];

    console.log("\n[MOCK NOTIFICATION]");
    console.log(
      "Payload:",
      JSON.stringify(req.body, null, 2)
    );

    if (
      secret !== process.env.WEBHOOK_SECRET
    ) {
      console.log("Secret verification: FAIL");

      return res.status(401).json({
        success: false,
        error: "Invalid webhook secret",
      });
    }

    console.log("Secret verification: PASS");

    res.status(200).json({
      success: true,
      message:
        "Notification event received",
      event_id: req.body.event_id,
    });
  }
);
// ====================
// REST API - Create Notification
// ====================
app.post("/api/notifications", (req, res) => {
  const requestTimestamp = new Date().toISOString();

  console.log("\n[NOTIFICATION API REQUEST]");
  console.log("Timestamp:", requestTimestamp);
  console.log(
    "Payload:",
    JSON.stringify(req.body, null, 2)
  );

  const {
    student_id,
    application_id,
    type,
    message,
  } = req.body;

  if (
    !student_id ||
    !application_id ||
    !type ||
    !message
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  const notificationId =
    `mock-notification-${Date.now()}`;

  const response = {
    success: true,
    notification_id: notificationId,
    status: "created",
    created_at: requestTimestamp,
  };

  console.log("Response:", response);

  res.status(201).json(response);
});
app.listen(5001, () => {
  console.log(
    "Mock Notification running on http://localhost:5001"
  );
});