require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

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
      .select("application_id")
      .eq("application_id", applicationId)
      .single();

    if (findError || !application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    // Update status
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

    res.json({
      success: true,
      message: "Application status updated successfully",
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
// Start Server
// ====================
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Job Board API running on http://localhost:${PORT}`);
  });
}

module.exports = app;