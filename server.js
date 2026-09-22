require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const {
  sendNotificationWebhook,
   createNotification,  
} = require("./integration/notificationClient");

const app = express();

app.use(express.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ====================
// Home
// ====================
app.get("/", (req, res) => {
  res.json({
    message: "Job Board API is running",
  });
});

// ====================
// Test Supabase Database
// ====================
app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .limit(5);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Connected to Supabase successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Create a Job
// ====================
app.post("/api/jobs", async (req, res) => {
  try {
    const {
      employer_id,
      title,
      description,
      category,
      location,
      province,
      status,
    } = req.body;

    // Validate required fields
    if (
      !employer_id ||
      !title ||
      !description ||
      !category ||
      !location ||
      !province
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Check employer
    const { data: employer, error: employerError } = await supabase
      .from("employers")
      .select("employer_id, approval_status")
      .eq("employer_id", employer_id)
      .single();

    if (employerError || !employer) {
      return res.status(404).json({
        success: false,
        error: "Employer not found",
      });
    }

    // Only approved employers can create jobs
    if (employer.approval_status !== "approved") {
      return res.status(403).json({
        success: false,
        error: "Employer is not approved",
      });
    }

    // Create job
    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          employer_id,
          title,
          description,
          category,
          location,
          province,
          status: status || "open",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Get All Jobs
// ====================
app.get("/api/jobs", async (req, res) => {
  try {
    const { province, category, status } = req.query;

    let query = supabase
      .from("jobs")
      .select(`
        job_id,
        employer_id,
        title,
        description,
        category,
        location,
        province,
        status,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });

    if (province) {
      query = query.eq("province", province);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Get One Job
// ====================
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        job_id,
        employer_id,
        title,
        description,
        category,
        location,
        province,
        status,
        created_at,
        updated_at
      `)
      .eq("job_id", jobId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Update a Job
// ====================
app.patch("/api/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    const {
      employer_id,
      title,
      description,
      category,
      location,
      province,
      status,
    } = req.body;

    // Validate employer_id
    if (!employer_id) {
      return res.status(400).json({
        success: false,
        error: "employer_id is required",
      });
    }

    // Check if job exists
    const { data: existingJob, error: findError } = await supabase
      .from("jobs")
      .select("job_id, employer_id")
      .eq("job_id", jobId)
      .single();

    if (findError || !existingJob) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Check job ownership
    if (Number(existingJob.employer_id) !== Number(employer_id)) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this job",
      });
    }

    // Build update object
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (location !== undefined) updates.location = location;
    if (province !== undefined) updates.province = province;
    if (status !== undefined) updates.status = status;

    // Nothing to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No fields to update",
      });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("jobs")
      .update(updates)
      .eq("job_id", jobId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Job updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Delete a Job
// ====================
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if job exists
    const { data: existingJob, error: findError } = await supabase
      .from("jobs")
      .select("job_id")
      .eq("job_id", jobId)
      .single();

    if (findError || !existingJob) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Delete job
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("job_id", jobId);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
      job_id: Number(jobId),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Submit Job Application
// ====================
app.post("/api/jobs/:jobId/applications", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { student_id } = req.body;

    // Validate student_id
    if (!student_id) {
      return res.status(400).json({
        success: false,
        error: "student_id is required",
      });
    }

    // Check student
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("student_id, consent_status")
      .eq("student_id", student_id)
      .single();

    if (studentError || !student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Check job
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("job_id, status")
      .eq("job_id", jobId)
      .single();

    if (jobError || !job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Job must be open
    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        error: "Job is not open for applications",
      });
    }

    // Check duplicate application
    const { data: existingApplication } = await supabase
      .from("applications")
      .select("application_id")
      .eq("student_id", student_id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        error: "Student has already applied for this job",
      });
    }

    // Create application
    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          student_id: student_id,
          job_id: jobId,
          status: "submitted",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Get Student Applications
// ====================
app.get("/api/applications/me", async (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        error: "student_id is required",
      });
    }

    const { data, error } = await supabase
      .from("applications")
      .select(`
        application_id,
        student_id,
        job_id,
        status,
        applied_at,
        updated_at,
        jobs (
          title,
          category,
          province,
          location,
          employers (
            company_name
          )
        )
      `)
      .eq("student_id", student_id)
      .order("applied_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Update Application Status
// ====================
app.patch("/api/applications/:applicationId/status", async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const allowedStatuses = [
      "submitted",
      "reviewing",
      "shortlisted",
      "rejected",
      "accepted",
    ];

    // Validate status
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid application status",
      });
    }

    // Check application exists
    const { data: application, error: findError } = await supabase
      .from("applications")
      .select("application_id, student_id, job_id, status")
      .eq("application_id", applicationId)
      .single();

    if (findError || !application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    // Update application status
    const { data, error } = await supabase
      .from("applications")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("application_id", applicationId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // ====================
    // Create Integration Event
    // ====================

    const eventId =
      `app-status-${applicationId}-${status}-${Date.now()}`;

    const event = {
      event_id: eventId,
      event_type: "APPLICATION_STATUS_CHANGED",
      timestamp: new Date().toISOString(),
      data: {
        application_id: data.application_id,
        student_id: data.student_id,
        job_id: data.job_id,
        old_status: application.status,
        new_status: data.status,
      },
    };

    // ====================
    // Save to Integration Outbox
    // ====================

    const targetUrl =
      `${process.env.NOTIFICATION_SERVICE_URL}/api/webhooks/jobboard`;

    const { error: outboxError } = await supabase
      .from("integration_outbox")
      .insert([
        {
          event_id: eventId,
          event_type: "APPLICATION_STATUS_CHANGED",
          target_url: targetUrl,
          payload: event,
          status: "pending",
          attempt_count: 0,
        },
      ]);

    if (outboxError) {
      console.error(
        "[OUTBOX ERROR]",
        outboxError.message
      );
    }

    // ====================
    // Send Webhook
    // ====================

    const notificationResult =
      await sendNotificationWebhook(event);

    // ====================
    // Update Outbox Result
    // ====================

    if (notificationResult.success) {
      await supabase
        .from("integration_outbox")
        .update({
          status: "sent",
          attempt_count: 1,
          sent_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("event_id", eventId);
    } else {
      await supabase
        .from("integration_outbox")
        .update({
          status: "pending",
          attempt_count: 1,
          last_error:
            notificationResult.error ||
            "Notification service unavailable",
        })
        .eq("event_id", eventId);
    }

    // Job Board still succeeds even if Notification fails
    res.json({
      success: true,
      message: "Application status updated successfully",
      data,
      integration: {
        event_id: eventId,
        notification_sent: notificationResult.success,
        notification_status: notificationResult.success
          ? "sent"
          : "pending",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Integration - Get Application
// ====================
app.get("/api/integration/applications/:applicationId", async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const requestTimestamp = new Date().toISOString();

    const partner =
      req.headers["x-partner-service"] || "unknown";

    console.log("\n[INTEGRATION REQUEST]");
    console.log("Timestamp:", requestTimestamp);
    console.log("Partner:", partner);
    console.log("Endpoint:", req.originalUrl);
    console.log("Application ID:", applicationId);

    const { data, error } = await supabase
      .from("applications")
      .select(`
        application_id,
        student_id,
        job_id,
        status,
        applied_at,
        updated_at
      `)
      .eq("application_id", applicationId)
      .single();

    if (error || !data) {
      console.log("Response: 404 Application not found");

      return res.status(404).json({
        success: false,
        error: "Application not found",
        requested_at: requestTimestamp,
      });
    }

    console.log("Response: 200 OK");
    console.log("Data:", data);

    res.json({
      success: true,
      requested_at: requestTimestamp,
      data,
    });
  } catch (error) {
    console.error("[INTEGRATION ERROR]", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Webhook Receiver - Notification Service
// ====================
app.post("/api/webhooks/notification", async (req, res) => {
  try {
    const receivedSecret =
      req.headers["x-webhook-secret"];

    const expectedSecret =
      process.env.WEBHOOK_SECRET;

    const receivedAt =
      new Date().toISOString();

    console.log("\n[WEBHOOK RECEIVED]");
    console.log("Timestamp:", receivedAt);
    console.log(
      "Payload:",
      JSON.stringify(req.body, null, 2)
    );

    // ====================
    // Verify Secret
    // ====================

    if (
      !receivedSecret ||
      receivedSecret !== expectedSecret
    ) {
      console.log("Secret verification: FAIL");

      return res.status(401).json({
        success: false,
        error: "Invalid webhook secret",
      });
    }

    console.log("Secret verification: PASS");

    const {
      event_id,
      event_type,
    } = req.body;

    // ====================
    // Validate Payload
    // ====================

    if (!event_id || !event_type) {
      return res.status(400).json({
        success: false,
        error:
          "event_id and event_type are required",
      });
    }

    // ====================
    // Check Duplicate
    // ====================

    const {
      data: existingEvent,
      error: existingError,
    } = await supabase
      .from("integration_events")
      .select("event_id")
      .eq("event_id", event_id)
      .maybeSingle();

    if (existingError) {
      console.error(
        "[WEBHOOK DB ERROR]",
        existingError.message
      );

      return res.status(500).json({
        success: false,
        error: existingError.message,
      });
    }

    if (existingEvent) {
      console.log(
        "Duplicate event:",
        event_id
      );

      return res.status(200).json({
        success: true,
        duplicate: true,
        event_id,
        message: "Event already processed",
      });
    }

    // ====================
    // Store Event
    // ====================

    const {
      data,
      error,
    } = await supabase
      .from("integration_events")
      .insert([
        {
          event_id,
          event_type,
          source: "notification-service",
          payload: req.body,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "[WEBHOOK STORE ERROR]",
        error.message
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    console.log("Stored event:", event_id);

    res.status(200).json({
      success: true,
      message: "Webhook received successfully",
      event_id,
      stored: true,
      received_at: receivedAt,
      data,
    });
  } catch (error) {
    console.error(
      "[WEBHOOK ERROR]",
      error.message
    );

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ====================
// Retry Pending Notification Events
// ====================
async function retryPendingNotifications() {
  try {
    const { data: pendingEvents, error } = await supabase
      .from("integration_outbox")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);

    if (error) {
      console.error("[RETRY DB ERROR]", error.message);
      return;
    }

    if (!pendingEvents || pendingEvents.length === 0) {
      return;
    }

    console.log(
      `\n[RETRY WORKER] Found ${pendingEvents.length} pending event(s)`
    );

    for (const item of pendingEvents) {
      console.log(
        `[RETRY] Event ${item.event_id} attempt #${item.attempt_count + 1}`
      );

      const result =
        await sendNotificationWebhook(item.payload);

      if (result.success) {
        await supabase
          .from("integration_outbox")
          .update({
            status: "sent",
            attempt_count: item.attempt_count + 1,
            last_error: null,
            sent_at: new Date().toISOString(),
          })
          .eq("event_id", item.event_id);

        console.log(
          `[RETRY SUCCESS] ${item.event_id}`
        );
      } else {
        const errorMessage =
          result.error ||
          (result.statusCode
            ? `HTTP ${result.statusCode}`
            : "Notification service unavailable");

        await supabase
          .from("integration_outbox")
          .update({
            status: "pending",
            attempt_count: item.attempt_count + 1,
            last_error: errorMessage,
          })
          .eq("event_id", item.event_id);

        console.log(
          `[RETRY FAILED] ${item.event_id}: ${errorMessage}`
        );
      }
    }
  } catch (error) {
    console.error(
      "[RETRY WORKER ERROR]",
      error.message
    );
  }
}
// ====================
// Integration - Create Notification
// Consumer Proof
// ====================
app.post(
  "/api/integration/notifications",
  async (req, res) => {
    try {
      const {
        application_id,
        message,
      } = req.body;

      if (!application_id) {
        return res.status(400).json({
          success: false,
          error: "application_id is required",
        });
      }

      // Find application
      const {
        data: application,
        error,
      } = await supabase
        .from("applications")
        .select(`
          application_id,
          student_id,
          job_id,
          status
        `)
        .eq(
          "application_id",
          application_id
        )
        .single();

      if (error || !application) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      const notification = {
        student_id:
          application.student_id,

        application_id:
          application.application_id,

        type:
          "APPLICATION_STATUS_CHANGED",

        message:
          message ||
          `Your application status is ${application.status}`,
      };

      const result =
        await createNotification(
          notification
        );

      if (!result.success) {
        return res.status(502).json({
          success: false,
          message:
            "Notification service request failed",
          integration: result,
        });
      }

      res.json({
        success: true,
        message:
          "Notification created successfully",
        integration: {
          partner_url:
            result.partnerUrl,

          request_timestamp:
            result.requestTimestamp,

          status_code:
            result.statusCode,

          partner_response:
            result.responseBody,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
// ====================
// Start Server
// ====================
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Job Board API running on http://localhost:${PORT}`
    );

    console.log(
      "Notification retry worker started (every 10 seconds)"
    );
  });

  // Retry pending events every 10 seconds
  setInterval(
    retryPendingNotifications,
    10000
  );
}

module.exports = app;