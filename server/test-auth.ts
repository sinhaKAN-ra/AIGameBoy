import express from "express";
import { setupAuth } from "./auth";
import cors from "cors";

// Create a minimal Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // Your client's URL
  credentials: true
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup authentication
setupAuth(app);

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Auth server is running" });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Auth test server running on port ${PORT}`);
  console.log(`Try these endpoints:
  - POST /api/register - Register a new user
  - POST /api/login - Login
  - POST /api/logout - Logout
  - GET /api/user - Get current user
  `);
});
