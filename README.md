# FocusFlow Backend API

DecodeLabs Full Stack Development Internship — **Project 2: Backend API Development**

A small REST API for **FocusFlow**, the student productivity dashboard built in Project 1. It handles tasks, study sessions and productivity statistics, and demonstrates routing, GET and POST requests, input validation, HTTP status codes and error handling.

## 1. Project description

The API lets a frontend:

- read and create **tasks**
- read and create **study sessions**
- read **productivity statistics** calculated from that data
- check that the server is running

Data is stored in an **in-memory JavaScript array**. It is loaded with sample data when the server starts and is lost when the server stops. This keeps the project simple; a real database is added in the next project.

## 2. Features

- RESTful endpoints (`/api/tasks`, `/api/study-sessions`, `/api/stats`)
- GET and POST requests with JSON
- Input validation with clear error messages
- Correct HTTP status codes (200, 201, 400, 404, 500)
- Centralized error handling (the server never crashes on bad input or bad JSON)
- Consistent response format
- CORS enabled so the FocusFlow frontend can call the API
- Request logger (`METHOD URL STATUS`)

## 3. Technologies used

Node.js, Express.js, JavaScript, REST, JSON, CORS (npm package `cors`).

## 4. Project structure

```
Task-2/
├── server.js                 starts Express, adds middleware, mounts the routes
├── package.json
├── README.md
├── routes/
│   ├── taskRoutes.js         URL + method -> which controller function
│   ├── studyRoutes.js
│   └── statsRoutes.js
├── controllers/
│   ├── taskController.js     the logic of each endpoint
│   ├── studyController.js
│   └── statsController.js
├── data/
│   └── database.js           the in-memory arrays + helper functions
└── middleware/
    ├── validation.js         checks the input before the controller runs
    └── errorHandler.js       turns every error into a JSON response
```

### How a request flows

```
CLIENT  (browser / Postman)
   |   POST /api/tasks   { "title": "Practice LeetCode" }
   v
server.js          express.json() reads the JSON body, CORS and logger run
   v
ROUTE              routes/taskRoutes.js   finds the matching route
   v
VALIDATION         middleware/validation.js   bad input -> 400, stop here
   v
CONTROLLER         controllers/taskController.js   the endpoint logic
   v
DATA               data/database.js   reads / changes the array
   v
RESPONSE           201 + JSON back to the client
```

Any unexpected error goes to `middleware/errorHandler.js`, which sends a JSON error.

## 5. Installation

```bash
npm install
```

## 6. How to run

```bash
npm start
```

The API runs at **http://localhost:3000**. Open http://localhost:3000/api/health in a browser to check it.

## 7. API endpoints

| Method | URL                      | Description              | Success | Errors   |
| ------ | ------------------------ | ------------------------ | ------- | -------- |
| GET    | `/api/health`            | Is the server running?   | 200     |          |
| GET    | `/api/tasks`             | List all tasks           | 200     |          |
| GET    | `/api/tasks/:id`         | Get one task             | 200     | 400, 404 |
| POST   | `/api/tasks`             | Create a task            | 201     | 400      |
| GET    | `/api/study-sessions`    | List all study sessions  | 200     |          |
| POST   | `/api/study-sessions`    | Create a study session   | 201     | 400      |
| GET    | `/api/stats`             | Productivity statistics  | 200     |          |

**GET vs POST:** GET only *reads* data and sends nothing in the body, so calling it again changes nothing. POST *creates* something new: the data is sent as JSON in the request body, and every call adds a new item.

### Why RESTful resource names?

REST names the **thing** (a noun, plural) in the URL and uses the **HTTP method** as the verb.

| Correct (REST)       | Avoid                       |
| -------------------- | --------------------------- |
| `GET /api/tasks`     | `/getTasks`                 |
| `POST /api/tasks`    | `/createTask`               |
| `GET /api/tasks/:id` | `/getTaskById?id=1`         |

This keeps URLs predictable (anyone can guess `/api/study-sessions`), avoids repeating the verb twice, and works the same way for every resource.

### Response format

Success:

```json
{ "success": true, "message": "...", "data": { } }
```

Error:

```json
{ "success": false, "message": "..." }
```

## 8. Request and response examples

### GET /api/health

```json
{ "success": true, "message": "FocusFlow API is running" }
```

### GET /api/tasks  (200)

```json
{
  "success": true,
  "count": 4,
  "data": [
    { "id": 1, "title": "Practice Arrays", "completed": false },
    { "id": 2, "title": "Study DBMS", "completed": true }
  ]
}
```

### GET /api/tasks/2  (200)

```json
{ "success": true, "data": { "id": 2, "title": "Study DBMS", "completed": true } }
```

### GET /api/tasks/999  (404)

```json
{ "success": false, "message": "Task not found" }
```

### POST /api/tasks  (201)

Request body:

```json
{ "title": "Practice LeetCode" }
```

Response:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { "id": 5, "title": "Practice LeetCode", "completed": false }
}
```

### GET /api/study-sessions  (200)

```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "subject": "Data Structures", "duration": 60, "date": "2026-10-04" },
    { "id": 2, "subject": "DBMS", "duration": 45, "date": "2026-10-03" }
  ]
}
```

### POST /api/study-sessions  (201)

Request body:

```json
{ "subject": "Python", "duration": 60, "date": "2026-10-04" }
```

Response:

```json
{
  "success": true,
  "message": "Study session created successfully",
  "data": { "id": 4, "subject": "Python", "duration": 60, "date": "2026-10-04" }
}
```

### GET /api/stats  (200)

```json
{
  "success": true,
  "message": "Statistics calculated successfully",
  "data": {
    "totalTasks": 4,
    "completedTasks": 1,
    "pendingTasks": 3,
    "totalStudyMinutes": 195,
    "studySessions": 3
  }
}
```

The numbers are calculated from the stored data on every request; nothing is hard-coded.

## 9. Validation rules

| Field                          | Rule                                                  |
| ------------------------------ | ----------------------------------------------------- |
| Task `title`                   | required, string, 3 to 100 characters                 |
| Study session `subject`        | required, string, 2 to 100 characters                 |
| Study session `duration`       | required, number, greater than 0, at most 600         |
| Study session `date`           | required, a real date in `YYYY-MM-DD` format          |
| `:id` in the URL               | whole number, 1 or more                               |

Example error (400):

```json
{ "success": false, "message": "Task title must be between 3 and 100 characters" }
```

## 10. HTTP status codes used

| Code | Meaning       | When                                                    |
| ---- | ------------- | ------------------------------------------------------- |
| 200  | OK            | A GET request worked                                    |
| 201  | Created       | A POST request created a new task or study session      |
| 400  | Bad Request   | Invalid input, invalid id, or invalid JSON              |
| 404  | Not Found     | The task does not exist, or the route does not exist    |
| 500  | Server Error  | An unexpected error (the client only sees a generic message) |

## 11. Error handling

- `middleware/validation.js` rejects bad input with **400** before the controller runs.
- `middleware/errorHandler.js` is the last middleware. It handles invalid JSON (**400**), unknown routes (**404**) and everything else (**500**).
- The real error is only logged in the server console. The client gets a short, safe message and never sees internal details.

## 12. Testing with Postman (or Thunder Client)

Start the server (`npm start`), then:

| # | Request | Body | Expect |
| - | ------- | ---- | ------ |
| 1 | `GET http://localhost:3000/api/health` | | 200 |
| 2 | `GET http://localhost:3000/api/tasks` | | 200, `count` 4 |
| 3 | `GET http://localhost:3000/api/tasks/1` | | 200 |
| 4 | `GET http://localhost:3000/api/tasks/999` | | 404 |
| 5 | `GET http://localhost:3000/api/tasks/abc` | | 400 |
| 6 | `POST http://localhost:3000/api/tasks` | `{ "title": "Practice LeetCode" }` | 201 |
| 7 | `POST http://localhost:3000/api/tasks` | `{ "title": "" }` or `{ "title": "ab" }` or `{}` | 400 |
| 8 | `GET http://localhost:3000/api/study-sessions` | | 200 |
| 9 | `POST http://localhost:3000/api/study-sessions` | `{ "subject": "Python", "duration": 60, "date": "2026-10-04" }` | 201 |
| 10 | `POST http://localhost:3000/api/study-sessions` | `{ "subject": "Py", "duration": -5, "date": "2026-10-04" }` | 400 |
| 11 | `POST http://localhost:3000/api/study-sessions` | `{ "subject": "Py", "duration": 30, "date": "2026-02-31" }` | 400 |
| 12 | `GET http://localhost:3000/api/stats` | | 200 (changes after steps 6 and 9) |

For POST requests set the header `Content-Type: application/json` and choose **Body > raw > JSON**. Sending broken JSON such as `{bad` returns 400 and the server keeps running.

All GET endpoints can also be opened directly in a browser.

## 13. Future improvements

- Replace the in-memory array with a real database so data survives a restart (next project)
- Add PUT and DELETE endpoints for full CRUD
- Add authentication and one task list per user
- Add automated tests
