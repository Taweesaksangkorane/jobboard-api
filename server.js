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
// Start Server
// ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Job Board API running on http://localhost:${PORT}`);
});