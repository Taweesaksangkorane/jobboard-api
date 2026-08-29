const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.json({
    message: "Job Board API is running"
  });
});

app.get("/api/jobs", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select(`
        job_id,
        title,
        description,
        category,
        location,
        province,
        status,
        created_at,
        updated_at,
        employers (
          employer_id,
          company_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Job Board API running on http://localhost:${PORT}`);
});