# Assignment: Data and Query Design

## Project Information

**Project:** Job Board API
**Team:** Team 18
**Database:** Supabase PostgreSQL
**Technology:** Node.js, Express.js, Supabase, PostgreSQL
**Submission Date:** 31 August 2026

**Student Names and IDs:**

* [6731503012 Taweesak Sangkoranee]
* [6731503036 Wichayapon Seepin]
* [6731503044 Aubolwan Maneechan]
* [6731503123 Sawitta Thiabsaeng]
* [6731503127 Onpreya Thinan]

---

# 1. Project Overview

The **Job Board API** is a RESTful backend system designed to connect students with employers and job opportunities.

The system manages:

* Student profiles
* Employers
* Job postings
* Student skills
* Job required skills
* Job applications
* Application files
* Application status

The system also supports job searching and filtering, student application management, application status updates, and skill-based job matching.

The API is developed using **Node.js, Express.js, JavaScript, and Supabase PostgreSQL**.

---

# 2. Technology Stack

| Technology | Purpose                                 |
| ---------- | --------------------------------------- |
| Node.js    | Runtime environment                     |
| Express.js | REST API framework                      |
| JavaScript | Programming language                    |
| Supabase   | Backend platform and PostgreSQL hosting |
| PostgreSQL | Relational database                     |
| Jest       | Automated testing framework             |
| Supertest  | API endpoint testing                    |
| dotenv     | Environment variable management         |

---

# 3. Database Selection

## 3.1 Selected Database

The selected database for the Job Board API is **Supabase PostgreSQL**.

Supabase provides a cloud-hosted PostgreSQL relational database with a web-based dashboard and SQL Editor.

## 3.2 Reasons for Choosing Supabase PostgreSQL

Supabase PostgreSQL was selected because the Job Board contains multiple related entities.

For example:

* One employer can create many jobs.
* One student can submit many applications.
* One job can receive applications from many students.
* One student can have many skills.
* One job can require many skills.

A relational database is therefore suitable for this project.

PostgreSQL also provides:

* Primary Keys
* Foreign Keys
* Unique Constraints
* Check Constraints
* Composite Primary Keys
* SQL queries
* Relational joins

Supabase was also selected because it provides:

* Cloud-hosted PostgreSQL
* SQL Editor
* Table Editor
* Database relationship management
* REST API support
* Suitable free-tier resources for an academic project

---

# 4. Database Requirements and Business Rules

The database follows these main rules:

1. Each student has a unique email address.
2. Each employer has a unique email address.
3. Each skill has a unique name.
4. Each job belongs to one employer.
5. One employer can create many jobs.
6. One student can submit many applications.
7. One job can receive many applications.
8. A student cannot apply to the same job more than once.
9. Students can have multiple skills.
10. Jobs can require multiple skills.
11. An application can have zero or one application file in the current MVP.
12. Job status is limited to `draft`, `open`, or `closed`.
13. Application status is limited to `submitted`, `reviewing`, `shortlisted`, `rejected`, or `accepted`.
14. Deleting a job also deletes related applications and job-skill records through `ON DELETE CASCADE`.
15. Deleting a student also deletes related applications and student-skill records.
16. Deleting an application also deletes its related application file.

---

# 5. Database Structure

The database contains **8 tables**:

1. `students`
2. `employers`
3. `jobs`
4. `applications`
5. `application_files`
6. `skills`
7. `student_skills`
8. `job_skills`

---

# 6. ER Diagram

The database relationships are shown below.

```mermaid
erDiagram

    STUDENTS {
        bigint student_id PK
        varchar full_name
        varchar email UK
        boolean consent_status
        timestamptz created_at
    }

    EMPLOYERS {
        bigint employer_id PK
        varchar company_name
        varchar email UK
        varchar approval_status
        timestamptz created_at
    }

    JOBS {
        bigint job_id PK
        bigint employer_id FK
        varchar title
        text description
        varchar category
        varchar location
        varchar province
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }

    APPLICATIONS {
        bigint application_id PK
        bigint student_id FK
        bigint job_id FK
        varchar status
        timestamptz applied_at
        timestamptz updated_at
    }

    APPLICATION_FILES {
        bigint file_id PK
        bigint application_id FK
        varchar file_name
        varchar file_type
        bigint file_size
        text file_url
        timestamptz uploaded_at
    }

    SKILLS {
        bigint skill_id PK
        varchar name UK
    }

    STUDENT_SKILLS {
        bigint student_id PK, FK
        bigint skill_id PK, FK
    }

    JOB_SKILLS {
        bigint job_id PK, FK
        bigint skill_id PK, FK
    }

    EMPLOYERS ||--o{ JOBS : creates
    STUDENTS ||--o{ APPLICATIONS : submits
    JOBS ||--o{ APPLICATIONS : receives
    APPLICATIONS ||--o| APPLICATION_FILES : has

    STUDENTS ||--o{ STUDENT_SKILLS : has
    SKILLS ||--o{ STUDENT_SKILLS : belongs_to

    JOBS ||--o{ JOB_SKILLS : requires
    SKILLS ||--o{ JOB_SKILLS : belongs_to
```

### Screenshot – ER Diagram

> **[![alt text](image-2.png)]**
>
> *Figure 1. ER Diagram of the Job Board database.*

---

# 7. Database Schema

## 7.1 Students

The `students` table stores information about students using the Job Board.

| Column           | Data Type   | Nullable | Constraint  | Default |
| ---------------- | ----------- | -------- | ----------- | ------- |
| `student_id`     | bigint      | No       | Primary Key | —       |
| `full_name`      | varchar     | No       | —           | —       |
| `email`          | varchar     | No       | Unique      | —       |
| `consent_status` | boolean     | No       | —           | false   |
| `created_at`     | timestamptz | No       | —           | now()   |

---

## 7.2 Employers

The `employers` table stores employer and company information.

| Column            | Data Type   | Nullable | Constraint  | Default |
| ----------------- | ----------- | -------- | ----------- | ------- |
| `employer_id`     | bigint      | No       | Primary Key | —       |
| `company_name`    | varchar     | No       | —           | —       |
| `email`           | varchar     | No       | Unique      | —       |
| `approval_status` | varchar     | No       | Check       | pending |
| `created_at`      | timestamptz | No       | —           | now()   |

Allowed `approval_status` values:

```text
pending
approved
rejected
```

---

## 7.3 Jobs

The `jobs` table stores job postings created by employers.

| Column        | Data Type   | Nullable | Constraint  | Default |
| ------------- | ----------- | -------- | ----------- | ------- |
| `job_id`      | bigint      | No       | Primary Key | —       |
| `employer_id` | bigint      | No       | Foreign Key | —       |
| `title`       | varchar     | No       | —           | —       |
| `description` | text        | No       | —           | —       |
| `category`    | varchar     | No       | —           | —       |
| `location`    | varchar     | No       | —           | —       |
| `province`    | varchar     | No       | —           | —       |
| `status`      | varchar     | No       | Check       | open    |
| `created_at`  | timestamptz | No       | —           | now()   |
| `updated_at`  | timestamptz | No       | —           | now()   |

Foreign Key:

```text
jobs.employer_id
        ↓
employers.employer_id
```

Allowed job statuses:

```text
draft
open
closed
```

---

## 7.4 Applications

The `applications` table stores applications submitted by students.

| Column           | Data Type   | Nullable | Constraint  | Default   |
| ---------------- | ----------- | -------- | ----------- | --------- |
| `application_id` | bigint      | No       | Primary Key | —         |
| `student_id`     | bigint      | No       | Foreign Key | —         |
| `job_id`         | bigint      | No       | Foreign Key | —         |
| `status`         | varchar     | No       | Check       | submitted |
| `applied_at`     | timestamptz | No       | —           | now()     |
| `updated_at`     | timestamptz | No       | —           | now()     |

Foreign Keys:

```text
applications.student_id
        ↓
students.student_id

applications.job_id
        ↓
jobs.job_id
```

The database uses:

```text
UNIQUE (student_id, job_id)
```

This prevents a student from applying to the same job more than once.

---

## 7.5 Application Files

The `application_files` table stores references to files associated with applications.

| Column           | Data Type   | Nullable | Constraint          | Default |
| ---------------- | ----------- | -------- | ------------------- | ------- |
| `file_id`        | bigint      | No       | Primary Key         | —       |
| `application_id` | bigint      | No       | Foreign Key, Unique | —       |
| `file_name`      | varchar     | No       | —                   | —       |
| `file_type`      | varchar     | No       | —                   | —       |
| `file_size`      | bigint      | No       | Check               | —       |
| `file_url`       | text        | No       | —                   | —       |
| `uploaded_at`    | timestamptz | No       | —                   | now()   |

The database uses:

```text
UNIQUE (application_id)
```

Therefore, one application can have at most one application file in the current MVP.

The database also checks:

```text
file_size > 0
```

---

## 7.6 Skills

The `skills` table stores skills that can be associated with students and jobs.

| Column     | Data Type | Nullable | Constraint  |
| ---------- | --------- | -------- | ----------- |
| `skill_id` | bigint    | No       | Primary Key |
| `name`     | varchar   | No       | Unique      |

Example skills:

```text
JavaScript
TypeScript
React
Node.js
Python
SQL
Git
Docker
```

---

## 7.7 Student Skills

The `student_skills` table is a junction table between students and skills.

| Column       | Data Type | Nullable | Constraint               |
| ------------ | --------- | -------- | ------------------------ |
| `student_id` | bigint    | No       | Primary Key, Foreign Key |
| `skill_id`   | bigint    | No       | Primary Key, Foreign Key |

Primary Key:

```text
PRIMARY KEY (student_id, skill_id)
```

This creates a many-to-many relationship between students and skills.

---

## 7.8 Job Skills

The `job_skills` table is a junction table between jobs and skills.

| Column     | Data Type | Nullable | Constraint               |
| ---------- | --------- | -------- | ------------------------ |
| `job_id`   | bigint    | No       | Primary Key, Foreign Key |
| `skill_id` | bigint    | No       | Primary Key, Foreign Key |

Primary Key:

```text
PRIMARY KEY (job_id, skill_id)
```

This creates a many-to-many relationship between jobs and skills.

---

# 8. Database Relationships

## 8.1 Employer → Jobs

```text
1 Employer
     |
     | creates
     |
     └───< Many Jobs
```

One employer can create many job postings.

---

## 8.2 Student → Applications

```text
1 Student
     |
     | submits
     |
     └───< Many Applications
```

One student can submit many applications.

---

## 8.3 Job → Applications

```text
1 Job
     |
     | receives
     |
     └───< Many Applications
```

One job can receive applications from many students.

---

## 8.4 Student ↔ Skills

```text
Students
    |
    └── Student_Skills ── Skills
```

Students and skills have a many-to-many relationship.

---

## 8.5 Job ↔ Skills

```text
Jobs
    |
    └── Job_Skills ── Skills
```

Jobs and skills have a many-to-many relationship.

---

## 8.6 Application → Application File

```text
1 Application
      |
      └── 0..1 Application File
```

An application can have zero or one file.

---

# 9. Database Constraints

The actual database contains the following important constraints.

| Table               | Constraint            | Purpose                                    |
| ------------------- | --------------------- | ------------------------------------------ |
| `students`          | Primary Key           | Identifies each student                    |
| `students`          | Unique email          | Prevents duplicate student emails          |
| `employers`         | Primary Key           | Identifies each employer                   |
| `employers`         | Unique email          | Prevents duplicate employer emails         |
| `employers`         | Approval status CHECK | Restricts employer status                  |
| `jobs`              | Primary Key           | Identifies each job                        |
| `jobs`              | Foreign Key           | Connects jobs to employers                 |
| `jobs`              | Status CHECK          | Restricts job status                       |
| `applications`      | Primary Key           | Identifies each application                |
| `applications`      | Foreign Keys          | Connects applications to students and jobs |
| `applications`      | Unique student/job    | Prevents duplicate applications            |
| `applications`      | Status CHECK          | Restricts application status               |
| `application_files` | Primary Key           | Identifies each file                       |
| `application_files` | Unique application ID | Allows maximum one file per application    |
| `application_files` | File size CHECK       | Prevents non-positive file size            |
| `skills`            | Primary Key           | Identifies each skill                      |
| `skills`            | Unique name           | Prevents duplicate skills                  |
| `student_skills`    | Composite Primary Key | Prevents duplicate student-skill pairs     |
| `job_skills`        | Composite Primary Key | Prevents duplicate job-skill pairs         |

### Screenshot – Constraints

> **[![alt text](image-3.png)]**
>
> *Figure 2. Supabase database constraints and relationships.*

---

# 10. Remote Database Deployment

The database schema was deployed to a remote Supabase PostgreSQL database.

## Deployment Information

**Supabase Project Name:** [job-board]

**Project Region:** [ap-northeast-1]

**Deployment Date:** [Deployment Date: 29 August 2026]

**Migration Status:** [Success. No rows returned]

The deployed database contains the following eight tables:

```text
students
employers
jobs
applications
application_files
skills
student_skills
job_skills
```

### Screenshot – Supabase Table Editor

> **[![alt text](image.png)]**
>
> *Figure 3. Supabase Table Editor showing the eight database tables.*

### Screenshot – SQL Editor

> **[![alt text](image-1.png)]**
>
> *Figure 4. Supabase SQL Editor showing successful schema execution.*

---

# 11. API Design

The Job Board API uses RESTful endpoints.

## 11.1 Jobs API

| Method | Endpoint        | Description  |
| ------ | --------------- | ------------ |
| GET    | `/api/jobs`     | Get all jobs |
| GET    | `/api/jobs/:id` | Get one job  |
| POST   | `/api/jobs`     | Create a job |
| PATCH  | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |

The `jobs` resource supports complete CRUD operations.

---

## 11.2 Application API

| Method | Endpoint                                  | Description                |
| ------ | ----------------------------------------- | -------------------------- |
| POST   | `/api/jobs/:jobId/applications`           | Submit an application      |
| GET    | `/api/applications/me`                    | Get student's applications |
| PATCH  | `/api/applications/:applicationId/status` | Update application status  |

---

## 11.3 Testing and Health Check

| Method | Endpoint       | Description                       |
| ------ | -------------- | --------------------------------- |
| GET    | `/`            | Check whether the API is running  |
| GET    | `/api/test-db` | Test Supabase database connection |

---

# 12. CRUD Operations

## 12.1 Create Job

```http
POST /api/jobs
Content-Type: application/json
```

Example request:

```json
{
  "employer_id": 1,
  "title": "Backend Developer Intern",
  "description": "Develop backend APIs and database systems.",
  "category": "Software Development",
  "location": "Mueang Chiang Rai",
  "province": "Chiang Rai"
}
```

Expected result:

```text
HTTP 201 Created
```

### Screenshot – Create Job

> **[![alt text](image-4.png)]**
>
> *Figure 5. POST /api/jobs successfully creating a job.*

---

# 13. Read Jobs

## 13.1 Get All Jobs

```http
GET /api/jobs
```

Expected result:

```text
HTTP 200 OK
```

### Screenshot – Get All Jobs

> **[![alt text](image-5.png)]**
>
> *Figure 6. GET /api/jobs response.*

---

## 13.2 Filter Jobs

The API supports filtering jobs by:

* Province
* Category
* Status

Example:

```http
GET /api/jobs?province=Chiang%20Rai
```

Another example:

```http
GET /api/jobs?category=Software%20Development&status=open
```

### Screenshot – Job Filtering

> **[![alt text](image-6.png)]**
>
> *Figure 7. Job filtering by province, category, or status.*

---

# 14. Get One Job

```http
GET /api/jobs/6
```

Expected result:

```text
HTTP 200 OK
```

### Screenshot – Get One Job

> **[![alt text](image-7.png)]**
>
> *Figure 8. GET /api/jobs/:id response.*

---

# 15. Update Job

```http
PATCH /api/jobs/6
Content-Type: application/json
```

Example request:

```json
{
  "title": "Backend Developer Intern",
  "description": "Develop backend APIs and database systems."
}
```

Expected result:

```text
HTTP 200 OK
```

### Screenshot – Update Job

> **[![alt text](image-8.png)]**
>
> *Figure 9. PATCH /api/jobs/:id successfully updating a job.*

---

# 16. Delete Job

```http
DELETE /api/jobs/6
```

Expected result:

```text
HTTP 200 OK
```

### Screenshot – Delete Job

> **[![alt text](image-9.png)]**
>
> *Figure 10. DELETE /api/jobs/:id successfully deleting a job.*

---

# 17. Submit Job Application

```http
POST /api/jobs/6/applications
Content-Type: application/json
```

Example request:

```json
{
  "student_id": 4
}
```

Expected result:

```text
HTTP 201 Created
```

### Screenshot – Submit Application

> **[![alt text](image-10.png)]**
>
> *Figure 11. Student successfully submitting a job application.*

---

# 18. Application Validation

The API validates application submissions.

## 18.1 Missing Student ID

Request:

```json
{}
```

Expected:

```text
HTTP 400 Bad Request
```

### Screenshot

> **[![alt text](image-11.png)]**
>
> *Figure 12. Validation for missing student_id.*

---

## 18.2 Student Not Found

Expected:

```text
HTTP 404 Not Found
```

### Screenshot

> **[![alt text](image-12.png)]**
>
> *Figure 13. Validation when the student does not exist.*

---

## 18.3 Job Not Found

Expected:

```text
HTTP 404 Not Found
```

### Screenshot

> **[![alt text](image-13.png)]**
>
> *Figure 14. Validation when the job does not exist.*

---

## 18.4 Duplicate Application

If the same student attempts to apply to the same job twice, the database unique constraint prevents the duplicate.

Expected:

```text
HTTP 409 Conflict
```

Example error:

```json
{
  "success": false,
  "error": "Student has already applied for this job"
}
```

### Screenshot – Duplicate Application

> **[![alt text](image-14.png)]**
>
> *Figure 15. Duplicate application rejected with HTTP 409 Conflict.*

---

# 19. Get Student Applications

```http
GET /api/applications/me?student_id=4
```

Expected result:

```text
HTTP 200 OK
```

The response contains the applications submitted by the selected student.

### Screenshot – Student Applications

> **[![alt text](image-15.png)]**
>
> *Figure 16. Student's submitted applications.*

---

# 20. Update Application Status

```http
PATCH /api/applications/3/status
Content-Type: application/json
```

Example request:

```json
{
  "status": "reviewing"
}
```

Allowed statuses:

```text
submitted
reviewing
shortlisted
rejected
accepted
```

Expected result:

```text
HTTP 200 OK
```

### Screenshot – Application Status

> **[![alt text](image-16.png)]**
>
> *Figure 17. Application status successfully updated.*

---

# 21. Skill Matching

The database supports matching jobs with students based on skills.

For example, a student may have:

```text
JavaScript
Node.js
SQL
```

The system can compare these skills with the required skills of jobs.

Example result:

| job_id | title                     | company_name                | matched_skill_count |
| -----: | ------------------------- | --------------------------- | ------------------: |
|      1 | Junior Software Developer | Tech Chiang Rai Co., Ltd.   |                   4 |
|      6 | Backend Developer Intern  | Tech Chiang Rai Co., Ltd.   |                   3 |
|      2 | Frontend Developer        | Tech Chiang Rai Co., Ltd.   |                   3 |
|      3 | Backend Developer         | Northern Software Co., Ltd. |                   2 |

The matching result can be used to rank jobs based on the number of matching skills.


---

# 22. Example SQL Queries

## 22.1 Find Open Jobs in a Province

```sql
SELECT
    j.job_id,
    j.title,
    e.company_name,
    j.category,
    j.province,
    j.status
FROM jobs AS j
JOIN employers AS e
    ON e.employer_id = j.employer_id
WHERE j.status = 'open'
  AND j.province = 'Chiang Rai'
ORDER BY j.created_at DESC;
```

---

## 22.2 View Skills Required by a Job

```sql
SELECT
    j.title,
    s.name AS required_skill
FROM jobs AS j
JOIN job_skills AS js
    ON js.job_id = j.job_id
JOIN skills AS s
    ON s.skill_id = js.skill_id
WHERE j.job_id = 1
ORDER BY s.name;
```

---

## 22.3 View a Student's Applications

```sql
SELECT
    a.application_id,
    j.title,
    e.company_name,
    a.status,
    a.applied_at
FROM applications AS a
JOIN jobs AS j
    ON j.job_id = a.job_id
JOIN employers AS e
    ON e.employer_id = j.employer_id
WHERE a.student_id = 1
ORDER BY a.applied_at DESC;
```

---

## 22.4 Find Jobs Matching Student Skills

```sql
SELECT
    j.job_id,
    j.title,
    e.company_name,
    COUNT(*) AS matched_skill_count
FROM student_skills AS ss
JOIN job_skills AS js
    ON js.skill_id = ss.skill_id
JOIN jobs AS j
    ON j.job_id = js.job_id
JOIN employers AS e
    ON e.employer_id = j.employer_id
WHERE ss.student_id = 1
  AND j.status = 'open'
GROUP BY
    j.job_id,
    j.title,
    e.company_name
ORDER BY
    matched_skill_count DESC,
    j.created_at DESC;
```

### Screenshot – SQL Query Results

> **[![alt text](image-17.png)]**
>
> *Figure 18. SQL query results from the Supabase SQL Editor.*

---

# 23. API Error Handling

The API uses HTTP status codes to communicate the result of requests.

| Status | Meaning                           |
| -----: | --------------------------------- |
|    200 | Successful request                |
|    201 | Resource successfully created     |
|    400 | Invalid request or missing fields |
|    403 | Operation is not permitted        |
|    404 | Resource not found                |
|    409 | Duplicate resource or conflict    |
|    500 | Server or database error          |

---

# 24. Automated API Testing

The project uses:

* Jest
* Supertest

Tests are executed using:

```bash
npm test
```

### Actual Test Result

**Test Suites:** [ADD ACTUAL RESULT]

**Tests:** [ADD ACTUAL RESULT]

**Snapshots:** [ADD ACTUAL RESULT]

**Time:** [ADD ACTUAL RESULT]

> **Important:** Replace the values above with the actual output from the team's latest `npm test` execution.

### Screenshot – Automated Tests

> **[![alt text](image-18.png)]**
>
> *Figure 19. Jest and Supertest automated API test results.*

---

# 25. Security Considerations

The project stores Supabase credentials in environment variables.

Example:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
PORT=3000
```

The `.env` file is excluded from Git:

```gitignore
.env
node_modules/
```

The project should also follow these security practices:

* Do not expose database credentials in source code.
* Do not expose the Supabase `service_role` key to frontend applications.
* Use HTTPS for production API communication.
* Validate request input.
* Check resource ownership before protected operations.
* Protect application status updates from unauthorized users.
* Validate uploaded file type and file size.

### Screenshot – Environment / Security Configuration

> **[![alt text](image-19.png)]**
>
> *Figure 20. Environment variable configuration with sensitive values hidden.*

---

# 26. Running the Project

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

The local API runs at:

```text
http://localhost:3000
```

---

# 27. API Testing Summary

The following API operations were implemented:

| Feature                   | Method | Endpoint                                  | Status      |
| ------------------------- | ------ | ----------------------------------------- | ----------- |
| Get all jobs              | GET    | `/api/jobs`                               | Implemented |
| Get one job               | GET    | `/api/jobs/:id`                           | Implemented |
| Create job                | POST   | `/api/jobs`                               | Implemented |
| Update job                | PATCH  | `/api/jobs/:id`                           | Implemented |
| Delete job                | DELETE | `/api/jobs/:id`                           | Implemented |
| Submit application        | POST   | `/api/jobs/:jobId/applications`           | Implemented |
| Get applications          | GET    | `/api/applications/me`                    | Implemented |
| Update application status | PATCH  | `/api/applications/:applicationId/status` | Implemented |
| Health check              | GET    | `/`                                       | Implemented |
| Database test             | GET    | `/api/test-db`                            | Implemented |

---

# 28. Conclusion

The Job Board API provides a relational backend system for connecting students and employers.

Supabase PostgreSQL was selected because the system contains multiple related entities including students, employers, jobs, skills, applications, and application files.

The database contains eight tables:

```text
students
employers
jobs
applications
application_files
skills
student_skills
job_skills
```

The database uses primary keys, foreign keys, unique constraints, composite primary keys, and check constraints to maintain data integrity.

In particular, the composite unique constraint:

```text
UNIQUE (student_id, job_id)
```

prevents a student from submitting the same job application more than once.

The API provides complete CRUD operations for the `jobs` resource and additional APIs for applications and skill-based job matching.

The final submission includes evidence from the actual Supabase database, API testing, SQL queries, and automated tests.

---

# 29. Final Submission Checklist

## Database

* [ ] Supabase project created
* [ ] Eight tables created
* [ ] ER Diagram added
* [ ] Table Editor screenshot added
* [ ] SQL deployment screenshot added
* [ ] Foreign key relationships verified
* [ ] Constraints verified

## API

* [ ] GET all jobs tested
* [ ] GET one job tested
* [ ] POST job tested
* [ ] PATCH job tested
* [ ] DELETE job tested
* [ ] Job filtering tested
* [ ] Application submission tested
* [ ] Student applications tested
* [ ] Application status update tested

## Validation

* [ ] Missing student ID tested
* [ ] Student not found tested
* [ ] Job not found tested
* [ ] Duplicate application tested
* [ ] Invalid status tested
* [ ] Unauthorized operation tested

## SQL Queries

* [ ] Open jobs query tested
* [ ] Job skills query tested
* [ ] Student applications query tested
* [ ] Skill matching query tested
* [ ] SQL result screenshots added

## Testing

* [ ] Jest tests executed
* [ ] Supertest tests executed
* [ ] Actual test result added
* [ ] Terminal screenshot added

## Submission

* [ ] Team member names and IDs added
* [ ] Supabase project name added
* [ ] Supabase region added
* [ ] Deployment date added
* [ ] All screenshots added
* [ ] No API keys or passwords shown
* [ ] Markdown reviewed
* [ ] Converted to PDF
* [ ] Final PDF checked
