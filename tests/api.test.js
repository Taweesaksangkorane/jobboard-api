const request = require("supertest");
const app = require("../server");

describe("Job Board API - Basic Tests", () => {
  test("GET / should return API running message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Job Board API is running");
  });

  test("GET /api/test-db should connect to Supabase", async () => {
    const response = await request(app).get("/api/test-db");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Connected to Supabase successfully"
    );
  });
});

describe("Job Board API - Jobs", () => {
  let createdJobId;

  test("POST /api/jobs should create a new job", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .send({
        employer_id: 1,
        title: "Automated Test Developer",
        description: "Job created by Jest automated test.",
        category: "Software Development",
        location: "Mueang Chiang Rai",
        province: "Chiang Rai",
        status: "open",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("job_id");

    createdJobId = response.body.data.job_id;
  });

  test("GET /api/jobs should return jobs", async () => {
    const response = await request(app).get("/api/jobs");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("GET /api/jobs/:id should return one job", async () => {
    const response = await request(app).get("/api/jobs/6");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.job_id).toBe(6);
  });

  test("GET /api/jobs/:id should return 404 for nonexistent job", async () => {
    const response = await request(app).get("/api/jobs/999999");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Job not found");
  });

  test("POST /api/jobs should return 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .send({
        employer_id: 1,
        title: "Incomplete Job",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Missing required fields");
  });

  test("POST /api/jobs should return 404 for nonexistent employer", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .send({
        employer_id: 999999,
        title: "Test Job",
        description: "Test description",
        category: "Software Development",
        location: "Chiang Rai",
        province: "Chiang Rai",
        status: "open",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Employer not found");
  });

  test("PATCH /api/jobs/:id should update a job", async () => {
    const response = await request(app)
      .patch("/api/jobs/6")
      .send({
        employer_id: 1,
        title: "Backend Developer Intern",
        description: "Develop backend APIs and database systems.",
        category: "Software Development",
        location: "Mueang Chiang Rai",
        province: "Chiang Rai",
        status: "open",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.job_id).toBe(6);
  });

  test("PATCH /api/jobs/:id should return 404 for nonexistent job", async () => {
    const response = await request(app)
      .patch("/api/jobs/999999")
      .send({
        employer_id: 1,
        title: "Test Update",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Job not found");
  });

  test("PATCH /api/jobs/:id should return 403 for unauthorized employer", async () => {
    const response = await request(app)
      .patch("/api/jobs/6")
      .send({
        employer_id: 2,
        title: "Unauthorized Update",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "You are not authorized to update this job"
    );
  });

  test("PATCH /api/jobs/:id should return 400 when no fields are provided", async () => {
    const response = await request(app)
      .patch("/api/jobs/6")
      .send({
        employer_id: 1,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("No fields to update");
  });

  test("DELETE /api/jobs/:id should delete the test job", async () => {
    expect(createdJobId).toBeDefined();

    const response = await request(app).delete(
      `/api/jobs/${createdJobId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.job_id).toBe(createdJobId);
  });

  test("DELETE /api/jobs/:id should return 404 for nonexistent job", async () => {
    const response = await request(app).delete("/api/jobs/999999");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Job not found");
  });
});

// ======================================================
// APPLICATION TESTS
// ======================================================

describe("Job Board API - Applications", () => {
  let testApplicationId;

  // --------------------------------------------------
  // CREATE APPLICATION
  // --------------------------------------------------

  test("POST /api/jobs/:jobId/applications should submit application", async () => {
    const response = await request(app)
      .post("/api/jobs/6/applications")
      .send({
        student_id: 4,
      });

    // Student 4 may already have an application from manual testing.
    // In that case, the API correctly returns 409.
    if (response.statusCode === 409) {
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(
        "Student has already applied for this job"
      );

      return;
    }

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Application submitted successfully"
    );
    expect(response.body.data).toHaveProperty("application_id");

    testApplicationId = response.body.data.application_id;
  });

  // --------------------------------------------------
  // MISSING STUDENT ID
  // --------------------------------------------------

  test("POST /api/jobs/:jobId/applications should return 400 when student_id is missing", async () => {
    const response = await request(app)
      .post("/api/jobs/6/applications")
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("student_id is required");
  });

  // --------------------------------------------------
  // STUDENT NOT FOUND
  // --------------------------------------------------

  test("POST /api/jobs/:jobId/applications should return 404 for nonexistent student", async () => {
    const response = await request(app)
      .post("/api/jobs/6/applications")
      .send({
        student_id: 999999,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Student not found");
  });

  // --------------------------------------------------
  // JOB NOT FOUND
  // --------------------------------------------------

  test("POST /api/jobs/:jobId/applications should return 404 for nonexistent job", async () => {
    const response = await request(app)
      .post("/api/jobs/999999/applications")
      .send({
        student_id: 4,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Job not found");
  });

  // --------------------------------------------------
  // DUPLICATE APPLICATION
  // --------------------------------------------------

  test("POST /api/jobs/:jobId/applications should reject duplicate application", async () => {
    const response = await request(app)
      .post("/api/jobs/6/applications")
      .send({
        student_id: 4,
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "Student has already applied for this job"
    );
  });

  // --------------------------------------------------
  // GET STUDENT APPLICATIONS
  // --------------------------------------------------

  test("GET /api/applications/me should return student applications", async () => {
    const response = await request(app)
      .get("/api/applications/me")
      .query({
        student_id: 4,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty("count");
  });

  // --------------------------------------------------
  // GET APPLICATIONS WITHOUT STUDENT ID
  // --------------------------------------------------

  test("GET /api/applications/me should return 400 when student_id is missing", async () => {
    const response = await request(app).get("/api/applications/me");

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("student_id is required");
  });

  // --------------------------------------------------
  // UPDATE APPLICATION STATUS
  // --------------------------------------------------

  test("PATCH /api/applications/:applicationId/status should update status", async () => {
    let applicationId = testApplicationId;

    // If the application already existed, find it.
    if (!applicationId) {
      const listResponse = await request(app)
        .get("/api/applications/me")
        .query({
          student_id: 4,
        });

      expect(listResponse.statusCode).toBe(200);
      expect(listResponse.body.data.length).toBeGreaterThan(0);

      applicationId = listResponse.body.data[0].application_id;
    }

    const response = await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .send({
        status: "reviewing",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Application status updated successfully"
    );
    expect(response.body.data.status).toBe("reviewing");
  });

  // --------------------------------------------------
  // INVALID APPLICATION STATUS
  // --------------------------------------------------

  test("PATCH /api/applications/:applicationId/status should reject invalid status", async () => {
    const response = await request(app)
      .patch("/api/applications/3/status")
      .send({
        status: "invalid_status",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Invalid application status");
  });

  // --------------------------------------------------
  // APPLICATION NOT FOUND
  // --------------------------------------------------

  test("PATCH /api/applications/:applicationId/status should return 404 for nonexistent application", async () => {
    const response = await request(app)
      .patch("/api/applications/999999/status")
      .send({
        status: "reviewing",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Application not found");
  });
});