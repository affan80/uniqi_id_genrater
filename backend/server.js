// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import qrRoutes from "./routes/qrRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse incoming JSON
app.use(morgan("dev")); // HTTP request logger

// Routes
app.use("/", qrRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Server is running successfully" });
});

// Start the server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
