const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL;

const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET;

async function sendNotificationWebhook(event) {
  if (!NOTIFICATION_SERVICE_URL) {
    console.error(
      "[INTEGRATION] NOTIFICATION_SERVICE_URL is not configured"
    );

    return {
      success: false,
      status: "not_configured",
    };
  }

  const baseUrl =
    NOTIFICATION_SERVICE_URL.replace(/\/$/, "");

  const url =
    `${baseUrl}/api/webhooks/jobboard`;

  const requestTimestamp =
    new Date().toISOString();

  try {
    console.log("\n[WEBHOOK SEND]");
    console.log("URL:", url);
    console.log("Timestamp:", requestTimestamp);
    console.log(
      "Payload:",
      JSON.stringify(event, null, 2)
    );

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": WEBHOOK_SECRET,
      },

      body: JSON.stringify(event),
    });

    const responseText =
      await response.text();

    let responseBody;

    try {
      responseBody =
        JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }

    console.log(
      "Partner status:",
      response.status
    );

    console.log(
      "Partner response:",
      responseBody
    );

    return {
      success: response.ok,
      statusCode: response.status,
      requestTimestamp,
      responseBody,
    };
  } catch (error) {
    console.error("\n[WEBHOOK FAILED]");
    console.error(
      "Timestamp:",
      requestTimestamp
    );
    console.error(
      "Error:",
      error.message
    );

    return {
      success: false,
      status: "unavailable",
      requestTimestamp,
      error: error.message,
    };
  }
}
async function createNotification(notification) {
  if (!NOTIFICATION_SERVICE_URL) {
    return {
      success: false,
      error: "NOTIFICATION_SERVICE_URL is not configured",
    };
  }

  const baseUrl =
    NOTIFICATION_SERVICE_URL.replace(/\/$/, "");

  const url =
    `${baseUrl}/api/notifications`;

  const requestTimestamp =
    new Date().toISOString();

  console.log("\n[CONSUMER REQUEST]");
  console.log("Partner URL:", url);
  console.log(
    "Request timestamp:",
    requestTimestamp
  );
  console.log(
    "Request body:",
    JSON.stringify(notification, null, 2)
  );

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(notification),
    });

    const responseText =
      await response.text();

    let responseBody;

    try {
      responseBody =
        JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }

    console.log(
      "Partner status:",
      response.status
    );

    console.log(
      "Partner response:",
      responseBody
    );

    return {
      success: response.ok,
      partnerUrl: url,
      requestTimestamp,
      statusCode: response.status,
      responseBody,
    };
  } catch (error) {
    console.error(
      "[CONSUMER REQUEST FAILED]",
      error.message
    );

    return {
      success: false,
      partnerUrl: url,
      requestTimestamp,
      error: error.message,
    };
  }
}
module.exports = {
  sendNotificationWebhook,
  createNotification,
};