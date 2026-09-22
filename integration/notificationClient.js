const crypto = require("crypto");

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL;

const EVENT_WEBHOOK_SECRET =
  process.env.EVENT_WEBHOOK_SECRET;

// ใช้ Test Student ของ Notification สำหรับ A5 ก่อน
const NOTIFICATION_USER_ID =
  process.env.NOTIFICATION_USER_ID;


// ====================
// Job Board -> Notification Webhook
// ====================
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

  if (!NOTIFICATION_USER_ID) {
    console.error(
      "[INTEGRATION] NOTIFICATION_USER_ID is not configured"
    );

    return {
      success: false,
      status: "user_not_configured",
    };
  }

  const baseUrl =
    NOTIFICATION_SERVICE_URL.replace(/\/$/, "");

  const url =
    `${baseUrl}/api/webhooks/jobboard`;

  const data = event.data || {};

  // Convert internal Job Board event
  // to Notification Hub webhook contract
  const partnerPayload = {
    event_id: event.event_id,
    event_type: event.event_type,

    userId: NOTIFICATION_USER_ID,

    title: "Job Application Status Updated",

    message:
      `Your application status has changed from ` +
      `${data.old_status} to ${data.new_status}`,

    severity: "medium",

    data: {
      application_id: data.application_id,
      student_id: data.student_id,
      job_id: data.job_id,
      old_status: data.old_status,
      new_status: data.new_status,
    },
  };

  // IMPORTANT:
  // Sign exactly the same JSON string
  // that will be sent in request body
  const rawBody =
    JSON.stringify(partnerPayload);

  let signature = null;

  if (EVENT_WEBHOOK_SECRET) {
    signature = crypto
      .createHmac(
        "sha256",
        EVENT_WEBHOOK_SECRET
      )
      .update(rawBody)
      .digest("hex");
  }

  const requestTimestamp =
    new Date().toISOString();

  try {
    console.log("\n[WEBHOOK SEND]");
    console.log("URL:", url);
    console.log(
      "Timestamp:",
      requestTimestamp
    );
    console.log(
      "Payload:",
      JSON.stringify(
        partnerPayload,
        null,
        2
      )
    );

    const headers = {
      "Content-Type": "application/json",
    };

    if (signature) {
      headers["x-event-signature"] =
        signature;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: rawBody,
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
    console.error(
      "\n[WEBHOOK FAILED]"
    );
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


// ====================
// Job Board -> Notification REST API
// Consumer Proof
// ====================
async function createNotification(notification) {
  if (!NOTIFICATION_SERVICE_URL) {
    return {
      success: false,
      error:
        "NOTIFICATION_SERVICE_URL is not configured",
    };
  }

  if (!NOTIFICATION_USER_ID) {
    return {
      success: false,
      error:
        "NOTIFICATION_USER_ID is not configured",
    };
  }

  const baseUrl =
    NOTIFICATION_SERVICE_URL.replace(/\/$/, "");

  const url =
    `${baseUrl}/api/notifications`;

  /*
    server.js ของเราสามารถส่งรูปแบบเดิมมาได้ เช่น:

    {
      student_id: 2,
      application_id: 2,
      type: "APPLICATION_STATUS_CHANGED",
      message: "..."
    }

    ตรงนี้จะแปลงให้เป็น contract
    ที่ Notification Hub รับจริง
  */
  const partnerPayload = {
    userId: NOTIFICATION_USER_ID,

    title:
      notification.title ||
      "Job Application Update",

    message:
      notification.message ||
      "Your job application has been updated.",

    severity:
      notification.severity ||
      "medium",

    metadata: {
      application_id:
        notification.application_id,

      student_id:
        notification.student_id,

      job_id:
        notification.job_id,

      type:
        notification.type ||
        "APPLICATION_STATUS_CHANGED",
    },
  };

  const requestTimestamp =
    new Date().toISOString();

  console.log(
    "\n[CONSUMER REQUEST]"
  );
  console.log(
    "Partner URL:",
    url
  );
  console.log(
    "Request timestamp:",
    requestTimestamp
  );
  console.log(
    "Request body:",
    JSON.stringify(
      partnerPayload,
      null,
      2
    )
  );

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify(partnerPayload),
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